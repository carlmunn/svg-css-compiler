'use strict';

const Mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');

module.exports.SvgHtml = class {
  constructor(opts){
    this.template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
    this.opts = opts;
  }
  
  toFile(file) {
    fs.writeFileSync(file, this.render());
  }

  render() {
    return Mustache.render(this.template, {
      count: '[COUNT]',
      css:   this.opts.css,
      svgs:  this.opts.svgs
    });
  }
}