'use strict';

const path        = require('path');
const SvgFile     = require('./svg-file').SvgFile
const PackVistor  = require('./svg-packer').SvgPacker;
const SvgTemplate = require('./svg-template').SvgTemplate;

class SvgGroup extends Array {

  constructor(){

    super();

    this.x       = 0;
    this.y       = 0;
    this._width  = 0;
    this._height = 0

    this.wasPacked = false;
    this.wasOrdered  = false;

    // TODO: needed?
    //this.parentGroup   = null;
  }

  arrangeGroups(){
    const packer = new PackVistor;
    packer.accept(this);
  }

  height(){
    return this.reduce((prev, cur, idx)=>{
      return prev + cur.height();
    }, 0);
  }

  // Width is only the widest item in the group.
  width(){
    return this.reduce((prev, cur, idx)=>{
      return prev < cur.width() ? cur.width() : prev;
    }, 0);
  }

  area(){
    return this.reduce((prev, cur, idx)=>{
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
    const dimensions = `DIM:${this.width()}x${this.height()}`;
    const area       = `AREA:${this.area()}`;

    return ['<GROUP:', area, this.length, this.inspectFiles(), '>'].join(' ');
  }

  inspectFiles(){
    return this.map(function(f){ return f.inspect() }).join(",");
  }

  printInfo(){
    console.info(`[SvgGroup] sorted: ${this.wasPacked} size: ${this.length}`);
    this.forEach((obj)=>{ console.info(obj); obj.printInfo(); });
  }

  useElement(){
    
    this._check();

    return this.map((obj)=>{
      return obj.useElement();
    });
  }

  toCss(spriteFile){
    const template = new SvgTemplate({template: 'css-sprites', attrs: {
      svgs: this,
      spriteFile: spriteFile
    }});
    
    return template.render();
  }
  
  toScss(){
    const SvgScss = require('./svg-scss').SvgScss;
    const svgScss = new SvgScss({
      svgGroup:   this,
      spriteFile: spriteFile
    });
    
    return svgScss.render();
  };

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
    //console.log('[D]', msg);
  }

  // Warn that the icons wheren't ordered or packed
  _check(){
    //if(!this.wasOrdered) console.warn('Was not ordered!');
    //if(!this.wasPacked) console.warn('Was not packed!');
  }
}

module.exports.SvgGroup = SvgGroup;