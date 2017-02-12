'use strict';

const path    = require('path');
const fs      = require('fs');
const cheerio = require('cheerio');

module.exports.SvgFile = class SvgFile {

  constructor(file){

    this.file    = file;
    this.content = fs.readFileSync(this.file, 'utf8');
    this.dom     = cheerio.load(this.content)('svg').first();

    const pos = this.position();

    this.xPos    = pos.x;
    this.yPos    = pos.y;
    this._height = pos.height;
    this._width  = pos.width;
  }

  contents(){
    return this.content;
  }

  // We need viewboxes to work out the parameters of where the boxes are placed.
  viewBox(){
    var _viewbox = this.dom.attr('viewbox');
    
    if(!_viewbox) throw("No viewbox for "+this.inspect());
    
    return _viewbox;
  }

  // Using the SVG 'viewBox' data we can infer the position.
  position(){
    const ary = this.viewBox().split(' ');
    
    return {
      x:      parseInt(ary[0]),
      y:      parseInt(ary[1]),
      width:  parseInt(ary[2]),
      height: parseInt(ary[3])
    };
  }

  // Match SvgGroup's functions
  width(){ return this._width; }
  height(){ return this._height };

  area(){
    return this._height*this._width;
  }

  // Could do with a better name. 
  // This is used to group files based on their shape and area.
  // P: portrait, L: Lanedscape, blank means it's Square;
  areaId(){
    if(this._height > this._width) return `P${this.area()}`;
    if(this._width > this._height) return `L${this.area()}`;
    return this.area();
  }

  symbolElement(){
    return `<symbol ${this._svgAttrs()}>${this.dom.html()}</symbol>`;
  }

  useElement(){
    return `<use xlink:href='#${this._attrId()}' x='${this.xPos}' y='${this.yPos}' width='${this._width}px' height='${this._height}px'/>`;
  }

  // Returns the CSS directive
  cssEntry(fileLocation){

    const _str = `.sprite-${this._attrId()} {
      background: url(${fileLocation}) ${this.xPos}px ${this.yPos}px;
      height: ${this.height()}px;
      width: ${this.width()}px;
    }`
    
    return _str;
  }

  printInfo(){
    console.info('[File]', this._width, 'X', this._height, 'Area', this.area());
  }

  inspect(){
    return ['<File:', path.basename(this.file), 'AREA:', this.areaId(), `${this.xPos}X${this.yPos}`, '>'].join(' ');
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