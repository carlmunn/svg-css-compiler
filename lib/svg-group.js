'use strict';

module.exports = class Group extends Array {

  constructor(){
    super()
    this.wasPacked = false;
    this.height    = 0;
    this.width     = 0;
  }

  pack(packFunc){
    this.apply(packfunc, this);
    this.wasPacked = true;
  }

  // Default for now
  packVertically() {
    let posX = 0;
    let posY = 0;

    this.forEach((el)=>{
      el.x = posX;
      el.y = posY;

      posY += el.height;
      
      if(this.width<el.width) this.width = el.width
    });

    this.height = posY;
  }
}