'use strict';

const path        = require('path');
const PackVistor  = require('./svg-packer').SvgPacker;
const SvgTemplate = require('./svg-template').SvgTemplate;
const extend      = require('util')._extend;
const Logger      = require('./logger').Logger;

class SvgGroup extends Array {

  constructor(){

    super();

    this.x       = 0;
    this.y       = 0;
    this._width  = 0;
    this._height = 0

    this.wasPacked   = false;
    this.wasOrdered  = false;
    
    // Postfix the files
    this.postfixUri  = null;
    
    this.logger  = new Logger({namespace: 'SvgGroup'});
    // TODO: needed?
    //this.parentGroup   = null;
  }

  arrangeGroups(){
    const packer = new PackVistor;
    packer.accept(this);
  }

  height(){
    return this.reduce((prev, cur, _idx)=>{
      return prev + cur.height();
    }, 0);
  }

  // Width is only the widest item in the group.
  width(){
    return this.reduce((prev, cur, _idx)=>{
      return prev < cur.width() ? cur.width() : prev;
    }, 0);
  }

  area(){
    return this.reduce((prev, cur, _idx)=>{
      return prev + cur.area();
    }, 0);
  }

  add(obj){
    // New object means we need to recalculate. Seems pointless for vertical placed
    // But I plan on having a best fit pack and this is just an easier/lazier way for now
    this.wasOrdered  = false;

    if(obj instanceof Array) {
      const childSvgGroup = new SvgGroup;
      obj.forEach((item)=>{ childSvgGroup.add(item); });
      this.push(obj);
    } else {
      this.push(obj);
    }
  }

  remove(el){
    this.wasOrdered = false;
    this.splice(this.indexOf(el), 1);
  }

  inspect(){
    const area = `AREA:${this.area()}`;

    return ['<GROUP:', area, this.length, this.inspectFiles(), '>'].join(' ');
  }

  inspectFiles(){
    return this.map(function(f){ return f.inspect() }).join(",");
  }

  printInfo(){
    this._log(`Sorted: ${this.wasPacked} size: ${this.length}`);
    this.forEach((obj)=>{ this._log(obj); obj.printInfo(); });
  }

  useElement(){
    
    this._check();

    return this.map((obj)=>{
      return obj.useElement();
    });
  }

  // Primary generator
  toCss(opts){
    
    const template = new SvgTemplate({template: 'css-sprites', attrs: {
      svgs: this,
      spriteFile: this._location(opts.spriteName, opts)
    }});
    
    return template.render();
  }

  // Primary generator
  toScss(opts){
    
    // Applies to all files within the group
    // TODO: Nested support need
    if(opts.postfixUri) this._applyPostfixUrl(opts.postfixUri);

    const template = new SvgTemplate({template: 'scss-mixins', attrs: {
      svgs:       this,
      spriteFile: `image-url("${this._location(opts.spriteName, extend(opts, {relative: false}))}")`
    }});
    
    return template.render();
  };
  
  _location(file, opts){
    
    this._log(`Applying postfixUrl to file for image-url() for ${file}`);

    if(opts.postfixUri) 
      return `${opts.postfixUri}${file}`;
    else if(opts.relative)
      return `./${file}`;
    else
      return file;
  }
  
  _applyPostfixUrl(str){
    
    if(!str) return;

    this.forEach((el)=>{
      const _filename = path.basename(el.uri)
      this._log(`Applying postfix to: ${_filename} => ${str}${_filename}`);
      el.uri = `${str}${_filename}`;
    });
  }
  
  symbolElement(){
    return this.map((obj)=>{
      return obj.symbolElement();
    });
  }

  // Default is vertical for now
  //
  // WARN: this is important, if the positions are showing as 0px then
  // this method wasn't called.
  // TODO: Feeling as though I need some trigger to throw
  // an exception if a method that depends on this is called.
  calcLocations(seedX, seedY){

    if(this.wasOrdered) return;

    this._log('Calculating X/Y positions')

    let posX = seedX || this.x;
    let posY = seedY || this.y;

    // Temp location pointers that will be adjusted as the 
    // the elements are updated. Also used to calculate the total
    // height and width.
    let ptrHeight = 0;
    let ptrWidth  = 0;

    this.forEach((el)=>{

      this._log(`Element: ${el.inspect()}`)

      el.x = posX;
      el.y = posY;

      // Not accumulating values so we just set the biggest
      if(ptrWidth<el.width()) ptrWidth = el.width();

      // Either take the element and adjust it's new position or recursively 
      // adjust the new group taking the current position to offset it.
      //
      // TODO: I haven't worked on this so it's not going to work, or will it...
      if(el instanceof Array)
        el.calcLocations(seedX, seedY);
      else
        el.yPos += posY;
      
      this._log(`Adding to ${el.height()} to posY`);
      posY += el.height();
      
      this._log(`New element: ${el.inspect()}`)
    });

    ptrHeight = posY;

    this.wasOrdered = true;
  }

  _log(msg) {
    this.logger.log(msg);
  }

  // Warn that the icons wheren't ordered or packed
  _check(){
    //if(!this.wasOrdered) console.warn('Was not ordered!');
    //if(!this.wasPacked) console.warn('Was not packed!');
  }
}

module.exports.SvgGroup = SvgGroup;