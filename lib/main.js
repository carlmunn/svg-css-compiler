'use strict';

const fs = require('fs');

const SvgFile      = require('./svg-processor');
const SvgProcessor = require('./svg-processor');

class MainApp {
  constructor(path) {
    this.processor = new SvgProcessor(path);
    this.svgFiles  = [];
  }

  // Add the sources for conversions
  add(dir){

    // fs.readdirSync(dir).forEach(function(idx, file){
      // console.info(idx, 'file', file)
    // })

    this.svgFiles = fs.readdirSync(dir);
  } 

  toHtml(){}
  toSvg(){}

  // Return our svg file objects, for debugging
  files(){
    return this.svgFiles;
  }
}

module.exports = MainApp;