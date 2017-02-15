'use strict';

const SvgTemplate = require('./svg-template').SvgTemplate;

module.exports.SvgHtml = class {
  constructor(opts){
    this.template = new SvgTemplate({template: 'basic-html', attrs: {
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