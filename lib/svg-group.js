'use strict';

const path       = require('path');
const SvgFile    = require('./svg-file').SvgFile
const PackVistor = require('./svg-packer').SvgPacker;

class SvgGroup extends Array {

  constructor(){

    super();

    this.x       = 0;
    this.y       = 0;
    this._width  = 0;
    this._height = 0

    this.wasPacked     = false;
    this.wasOrded     = false;

    // TODO: needed?
    //this.parentGroup   = null;
  }

  arrangeGroups(){
    const packer = new PackVistor;
    packer.accept(this);
  }

  // Default is vertical for now
  _calcLocations(seedX, seedY){

    if(this.wasOrded) return;

    let posX = seedX || this.x;
    let posY = seedY || this.y;

    // Temp location pointers that will be adjusted as the 
    // the elements are updated. Also used to calculate the total
    // height and width.
    let ptrHeight = 0;
    let ptrWidth  = 0;

    this.forEach((el)=>{

      el.x = posX;
      el.y = posY;

      posY += el.height();
      
      // Not accumulating values so we just set the biggest
      if(ptrWidth<el.width()) ptrWidth = el.width();

      if(el instanceof Array) el._calcLocations(seedX, seedY);
    });

    ptrHeight = posY;

    this.wasOrded = true;
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
    this.wasOrded = false;

    if(obj instanceof Array) {
      const childSvgGroup = new SvgGroup;
      obj.forEach((item)=>{ childSvgGroup.add(item); });
      this.push(obj);
    } else {
      this.push(obj);
    }
  }

  remove(el){
    this.wasOrded = false;
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
    this._calcLocations();

    return this.map((obj)=>{
      return obj.useElement();
    });
  }

  symbolElement(){
    return this.map((obj)=>{
      return obj.symbolElement();
    });
  }
}

module.exports.SvgGroup = SvgGroup;