'use strict';

const fs   = require('fs');
const path = require('path');

const SvgFile      = require('./svg-file');
const SvgProcessor = require('./svg-processor');

class MainApp {
  constructor(path) {
    this.processor = new SvgProcessor(path);
    this.svgFiles  = [];
    this.basePath  = ''
  }

  // Add the sources for conversions
  add(dir){
    this.basePath = dir

    fs.readdirSync(dir).forEach(function(file){
      
      if(!fs.statSync(this._basePath(file)).isDirectory()) {
        const svgFile = new SvgFile(this._basePath(file));
        this.svgFiles.push(svgFile);
      }

    }.bind(this));

    //this.svgFiles = fs.readdirSync(dir);
  } 

  toHtml(){}
  toSvg(){
    //<svg width='32' height="161" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><symbol  viewBox='0 0 36 33' id='brochure_icon'>
    //<symbol  viewBox='0 0 32 32' id='home2'>
    //<use xlink:href='#home' x='0' y='33' width='32px' height='32px'/>
  }

  // Return our svg file objects, for debugging/testing
  files(idx){
    return (typeof(idx)=='undefined' ? this.svgFiles : this.svgFiles[idx])
  }

  width() {
    return this.svgFiles.reduce((prev, cur, idx)=>{
      return prev + cur.position().width
    }, 0);
  }

  height() {
    return this.svgFiles.reduce((prev, cur, idx)=>{
      return prev + cur.position().height
    }, 0);
  }

  _basePath(filename){
    return path.join(this.basePath, filename);
  }

  _svg(content){

    const nsSvg    = 'xmlns="http://www.w3.org/2000/svg"';
    const nsXlink  = 'xmlns:xlink="xlink="http://www.w3.org/1999/xlink"';
    const nsSketch = 'xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"';

    return `<svg width='XXX' height='XXX' ${nsSvg} ${nsXlink} ${nsSketch}>${content}</svg>`;
  }
}

module.exports = MainApp;