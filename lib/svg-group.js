'use strict';

const SvgFile    = require('./svg-file').SvgFile
const PackVistor = require('./svg-packer').SvgPacker;

class SvgGroup extends Array {

  constructor(ary){

    super();

    this.wasPacked     = false;

    // These are updated as the group is packed
    this.pointerHeight = 0;
    this.pointerWidth  = 0;

    // TODO: needed?
    //this.parentGroup   = null;
  }

  sortForPacking(){
    const packer = new PackVistor;

    packer.accept(this);

    this.wasPacked = true;
  }

  // Default for now
  packVertically(){

    this.sortForPacking();

    let posX = 0;
    let posY = 0;

    this.forEach((el)=>{
      el.x = posX;
      el.y = posY;

      posY += el.pointerHeight;
      
      if(this.pointerWidth<el.pointerWidth) this.pointerWidth = el.pointerWidth
    });

    this.pointerHeight = posY;
  }

  height(){
    return this.reduce((prev, cur, idx)=>{
      return prev + cur.position().height;
    }, 0);
  }

  width(){
    return this.reduce((prev, cur, idx)=>{
      return prev + cur.position().width;
    }, 0);
  }

  add(obj){
    if(obj instanceof Array) {
      const childSvgGroup = new SvgGroup;
      obj.forEach((item)=>{ childSvgGroup.add(item); });
      this.push(obj);
    } else {
      this.push(obj);
    }
  }

  remove(el){
    this.splice(this.indexOf(el), 1);
  }

  inspect(){
    return ["<GROUP: ", this.length, this.inspectFiles(), '>'].join('');
  }

  inspectFiles(){
    return this.map(function(f){ return "\t"+f.inspect() }).join("\n")
  }

  printInfo(){
    console.info(`[SvgGroup] sorted: ${this.wasPacked} size: ${this.length}`);
    this.forEach((obj)=>{ console.info(obj); obj.printInfo(); });
  }

  symbolElement(){
    return 'xxx'
  }
}

module.exports.SvgGroup = SvgGroup;