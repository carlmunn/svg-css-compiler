'use strict';

module.exports.SvgCss = class {
  
  constructor(opts){
    this.template = new SvgTemplate({template: 'css', attrs: {
      spriteFile: opts.spriteFile,
      svgs:       opts.svgs
    }});
  }

  render(){
    this._log('Rendering CSS sprite entry');
    return this.template.render();
  }
  
  _log(msg) {
    //console.info('[D]', msg);
  }
}