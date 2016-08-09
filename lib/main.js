'use strict';

const fs   = require('fs');
const path = require('path');

const SvgFile      = require('./svg-file');
//const SvgProcessor = require('./svg-processor');
const SvgGroup     = require('./svg-group');

class MainApp {
  constructor(options) {
    //this.processor = new SvgProcessor(path);
    this.svgGroup    = new SvgGroup;
    this.basePath    = ''
    this.wasPacked   = false;
    this.raiseErrors = false; // TODO:
    this.logging     = false;
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
            this.svgGroup.push(svgFile);
          } catch(e) {
            console.error('ERROR:', e)
          }
        }
      }

    }.bind(this));

    return !!this.svgGroup.length
  } 

  toHtml(location){
    console.warn(`TODO: toHtml ${location}`);
  }

  toCss(location){
    console.warn(`TODO: toCss ${location}`);
  }

  toSvg(){
    // Default pack
    if(!this.wasPacked) this.svgGroup.packVertically();

    return this._svgElement(
      this._allSymbolElements().join("\n")+
      this._allUseElements().join("\n")
    );
  }

  toFile(location) {
    fs.writeFileSync(location, this.toSvg());
  }

  // Return our svg file objects, for debugging/testing
  files(idx){
    return (typeof(idx)=='undefined' ? this.svgGroup : this.svgGroup[idx])
  }

  width() {
    return this.svgGroup.reduce((prev, cur, idx)=>{
      return prev + cur.position().width
    }, 0);
  }

  height() {
    return this.svgGroup.reduce((prev, cur, idx)=>{
      return prev + cur.position().height
    }, 0);
  }

  _basePath(filename){
    return path.join(this.basePath, filename);
  }

  _allSymbolElements(){
    return this.svgGroup.reduce((ary, file, idx)=>{
      ary.push(file.symbolElement());
      return ary;
    }, []);
  }

  _allUseElements(){
    return this.svgGroup.reduce((ary, file, idx)=>{
      ary.push(file.useElement());
      return ary;
    }, []);
  }

  _svgElement(content){
    const head     = "<?xml version='1.0' encoding='UTF-8' standalone='no'?>";
    const nsSvg    = 'xmlns="http://www.w3.org/2000/svg"';
    const nsXlink  = 'xmlns:xlink="http://www.w3.org/1999/xlink"';
    const nsSketch = 'xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"';

    return head+`<svg width='${this.svgGroup.width}px' height='${this.svgGroup.height}px' ${nsSvg} ${nsXlink} ${nsSketch}>${content}</svg>`;
  }

  _log(){
    if(this.logging) console.log('[L]', ...arguments);
  }
}

module.exports = MainApp;