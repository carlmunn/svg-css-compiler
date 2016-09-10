'use strict';

const fs   = require('fs');
const path = require('path');

const SvgFile       = require('./svg-file').SvgFile;
const SvgGroup      = require('./svg-group').SvgGroup;
const CssGenerator  = require('./svg-css').SvgCss;
const HtmlGenerator = require('./svg-html').SvgHtml;

module.exports = class {

  constructor(options){
    this.svgGroup    = new SvgGroup;
    this.basePath    = ''
    this.wasPacked   = false;
    this.raiseErrors = false; // TODO:
    this.logging     = false;
    this.spriteName  = 'sprite.svg';
  }

  // Add the sources for conversions
  add(dir){
    this.basePath = dir
    const files   = fs.readdirSync(dir);

    files.forEach(function(file){
      
      if(!fs.statSync(this._basePath(file)).isDirectory()) {
        if(file.match(/\.svg$/)){
          try {
            this._log('adding file:', file)
            const svgFile = new SvgFile(this._basePath(file));
            this.svgGroup.add(svgFile);
          } catch(e) {
            console.error('ERROR:', e)
          }
        }
      }

    }.bind(this));

    return !!this.svgGroup.length
  } 

  toHtml(location){
    const htmlGen = new HtmlGenerator(this.svgGroup);
    htmlGen.toCSS();
  }

  toCSS(){
    // TODO: prob not necessary
    //const cssGen = new CssGenerator(this.svgGroup);
    //const spriteName = path.basename(this.basePath);
    return this.svgGroup.toCSS('./'+this.spriteName);
    // cssGen.toCSS();
  }

  toSvg(){

    this.svgGroup.calcLocations();

    this.sort

    return this._svgElement(
      this._allSymbolElements().join("\n")+
      this._allUseElements().join("\n")
    );
  }

  toFile(location){
    fs.writeFileSync(location, this.toSvg());
  }

  // Return our svg file objects, for debugging/testing
  files(idx){
    return (typeof(idx)=='undefined' ? this.svgGroup : this.svgGroup[idx])
  }

  width(){
    return this.svgGroup.width();
  }

  height(){
    return this.svgGroup.height();
  }

  _basePath(filename){
    return path.join(this.basePath, filename);
  }

  _allSymbolElements(){
    return this.svgGroup.symbolElement();
  }

  _allUseElements(){
    return this.svgGroup.useElement();
  }

  _svgElement(content){
    const head     = "<?xml version='1.0' encoding='UTF-8' standalone='no'?>";
    const nsSvg    = 'xmlns="http://www.w3.org/2000/svg"';
    const nsXlink  = 'xmlns:xlink="http://www.w3.org/1999/xlink"';
    const nsSketch = 'xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"';

    return head+`<svg width='${this.svgGroup.width()}px' height='${this.svgGroup.height()}px' ${nsSvg} ${nsXlink} ${nsSketch}>${content}</svg>`;
  }

  _log(){
    if(this.logging) console.log('[L]', ...arguments);
  }
}