const path    = require('path');
const fs      = require('fs');
const cheerio = require('cheerio');

module.exports.SvgFile = class SvgFile {
  constructor(file){

    this.file    = file
    this.content = fs.readFileSync(this.file, 'utf8');
    this.dom     = cheerio.load(this.content)('svg').first();

    const pos = this.position();

    this.x      = pos.x;
    this.y      = pos.y;
    this.height = pos.height;
    this.width  = pos.width;
  }

  contents(){
    return this.content;
  }

  viewBox(){
    return this.dom.attr('viewbox');
  }

  position(){
    const ary = this.viewBox().split(' ');
    
    return {
      x:      parseInt(ary[0]),
      y:      parseInt(ary[1]),
      width:  parseInt(ary[2]),
      height: parseInt(ary[3])
    };
  }

  area(){
    return this.height*this.width;
  }

  // Could do with a better name. 
  // This is used to group files based on their shape and area.
  // P: portrait, L: Lanescape, blank means it's Square;
  areaId(){
    if(this.height > this.width) return `P${this.area()}`;
    if(this.width > this.height) return `L${this.area()}`;
    return this.area();
  }

  symbolElement(){
    return `<symbol ${this._svgAttrs()}>${this.dom.html()}</symbol>`;
  }

  useElement(){
    return `<use xlink:href='#${this._attrId()}' x='${this.x}' y='${this.y}' width='${this.width}px' height='${this.height}px'/>`;
  }

  printInfo(){
    console.info('[File]', this.width, 'X', this.height, 'Area', this.area());
  }

  inspect(){
    return ['<File:', this.file, '>'].join(' ');
  }

  _svgAttrs(){
    const attrs = this._attrs();

    return Object.keys(attrs).reduce((acc, key) => {
      const value = attrs[key]
      return value ? `${acc} ${key}='${value}'` : acc;
    }, '');
  }

  _attrId(){
    return path.basename(this.file).replace(/\.svg$/, '').replace(/[\s_\-\.]/g, '-');
  }

  _attrAspectRatio(){
    return this.dom.attr('preserveaspectratio');
  }

  _attrs(){
    return {
      viewBox: this.viewBox(),
      id: this._attrId(),
      preserveAspectRatio: this._attrAspectRatio()
    };
  }
}