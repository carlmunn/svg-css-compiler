'use strict';

const Mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');

// wrapper for Mustache
// Helps with knowing where the files are and writing to a file
module.exports.SvgTemplate = class {
  constructor(opts){
    this.templateFile = path.join(__dirname, `templates/${opts.template}.template`)
    this.opts         = opts;
  }
  
  toFile(file) {
    fs.writeFileSync(file, this.render());
  }

  render() {
    return Mustache.render(this._templateContent(), this.opts.attrs);
  }
  
  _templateContent(){
    return fs.readFileSync(this.templateFile, 'utf8');
  }
}