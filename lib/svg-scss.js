'use strict';

const SvgTemplate = require('./svg-template').SvgTemplate;

module.exports.SvgScss = class {
  constructor(opts){
    this.template = new SvgTemplate({file: 'scss-mixins', attrs: {
      count: '[COUNT]',
      css:   opts.css,
      svgs:  opts.svgs
    }});
  }
  
  toFile(file) {
    this.template.toFile(file);
  }

  render() {
    return this.template.render();
  }
}