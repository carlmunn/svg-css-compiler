'use strict';

const fs   = require('fs');
const path = require('path');

const SvgFile       = require('./svg-file').SvgFile;
const SvgGroup      = require('./svg-group').SvgGroup;
const HtmlGenerator = require('./svg-html').SvgHtml;
const Config        = require('./config').Config;

module.exports = class {

  constructor(options){
    // Defaults:
    options = {...{
      spriteName: 'sprites'
    }, ...options}

    this.svgGroup    = new SvgGroup;
    this.basePath    = '';
    this.wasPacked   = false;
    this.logErrors   = true; // TODO:
    this.logging     = false;
    this.spriteName  = `${options.spriteName}.svg`;
    this.config      = options.config
  }

  // Add the sources for conversions
  add(dir){
    this.basePath = dir;
    const files   = fs.readdirSync(dir);

    files.forEach(function(file){
      if(!fs.statSync(this._basePath(file)).isDirectory()) {

        if(this._allowFile(file)){
          try {
            this._log('Adding file:', file);
            const opts = {'ignoreSprite': this._ignoreSprite(file)}
            const svgFile = new SvgFile(this._basePath(file), opts);
            this.svgGroup.add(svgFile);
          } catch(e) {
            if(this.logErrors) console.error('ERROR:', e);
          }
        }
      }
    }.bind(this));

    return !!this.svgGroup.length
  }

  toHtml(opts){
    const htmlGen = new HtmlGenerator({
      css:  this.renderCss(opts),
      svgs: this.files()
    });

    htmlGen.toFile(opts.file);
  }

  // Render all the CSS used to point to the icons within the grouped
  // SVG file. Taking the returned string and writing it to file is the
  // objective of this.
  //
  // Options:
  // postfixUri: Adds to the front of the URI the directory location.
  // Used for the single SVG files
  // useScss: Change the output to SCSS
  renderCss(opts = {}){

    this.svgGroup.calcLocations();

    if(opts.useScss)
      return this.svgGroup.toScss(opts);
    else
      return this.svgGroup.toCss(opts);
  }

  toSvg(){

    this.svgGroup.calcLocations();

    return this._svgElement(
      this._allSymbolElements().join("\n")+
      this._allUseElements().join("\n")
    );
  }

  toFile(location){
    fs.writeFileSync(location, this.toSvg());
  }

  // Return our SVG file objects, for debugging/testing
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

  _allowFile(filename){
    return (filename.match(/\.svg$/) && filename != this.spriteName);
  }

  _ignoreSprite(filename){
    return (this.config && this.config.ignoreFile(filename));
  }

  _log(){
    if(this.logging) console.log('[L]', ...arguments);
  }
}