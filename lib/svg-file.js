const path    = require('path');
const fs      = require('fs');
const cheerio = require('cheerio');

module.exports = class SvgFile {
  constructor(file) {
    //console.info('Processing:', file)

    this.file    = file
    this.content = fs.readFileSync(this.file, 'utf8');
    this.dom     = cheerio.load(this.content)('svg').first();

    const pos = this.position();

    this.x = pos.x;
    this.y = pos.y;
    this.height = pos.height;
    this.width = pos.width;
  }

  contents() {
    return this.content;
  }

  viewBox() {
    return this.dom.attr('viewbox');
  }

  position() {
    const ary = this.viewBox().split(' ');
    
    return {
      x:      parseInt(ary[0]),
      y:      parseInt(ary[1]),
      width:  parseInt(ary[2]),
      height: parseInt(ary[3])
    };
  }

  symbolElement(){
    return `<symbol ${this._svgAttrs()}>${this.dom.html()}</symbol>`;
  }

  useElement(){
    return `<use xlink:href='#${this._attrId()}' x='${this.x}' y='${this.y}' width='${this.width}px' height='${this.height}px'/>`;
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