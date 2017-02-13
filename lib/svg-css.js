'use strict';

module.exports.SvgCss = class {
  
  constructor(opts){
    this.svgGroup   = opts.svgGroup;
    this.spriteFile = opts.spriteFile;
  }

  render(){
    
    this._log('Creating simple CSS');
    
    const list = this.svgGroup.map((obj)=>{
      return `  ${obj.cssEntry(this.spriteFile)}`;
    });

    // Namespaced if needed, disabled for now.
    //return `.namespace {\n${list.join("\n")}\n}`;
    return list.join("\n");
  }
  
  _log(msg) {
    //console.info('[D]', msg);
  }
}