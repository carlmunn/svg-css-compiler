'use strict';

module.exports.Logger = class Logger {

  constructor(opts){
    this.opts = opts;
  }

  log(msg) {
    if(this._isEnabled())
      console.info(this._namespace("[L]"), msg);
  }

  warn() {
    if(this._isEnabled())
      console.info(this._namespace("[W]"), msg);
  }

  _namespace(header) {
    if(this.opts.namespace)
      return `[${this.opts.namespace}]${header}`;
    else
      return header
  }

  _isEnabled(){
    return false;
  }
}