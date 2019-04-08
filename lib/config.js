'use strict';

const fs   = require('fs');

exports.Config = class {
  constructor(filePath){
    this.file    = fs.readFileSync(filePath, 'utf8');
    this._config = JSON.parse(this.file);
  }

  ignoreFile(filename){
    const ary = this._config['sprite_ignores']
    return ary && ary.includes(filename)
  }
}