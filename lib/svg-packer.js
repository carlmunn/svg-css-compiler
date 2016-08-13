'use strict';

const classes = require('./svg-group');

module.exports.SvgPacker = class SvgPacker {

  constructor(){
    this.svgGroup = null;
  }

  accept(svgGroup){
    this.svgGroup = svgGroup;

    // Sort the Files based on area
    svgGroup.sort(this._areaSort, 'area'); 

    // Break the files into groups based on the same size.
    const newHash  = this._groupBy(svgGroup, 'areaId');

    //console.info('\n\nHash', newHash);
  }

  _areaSort(a, b){
    if(b.area() < a.area()) return -1;
    if(b.area() > a.area()) return +1;
    return 0;
  }

  // If item is not there place as an indivu
  _groupBy(ary, meth){
    return ary.reduce((prev, cur)=>{

      const area     = cur[meth]();
      const contents = prev[area];

      // If nil, if Array, else it's a single file
      if(!contents) {
        prev[area] = cur;
      } else if(contents instanceof classes.SvgGroup){
        contents.push(cur);
      } else {
        const group = new classes.SvgGroup;
        group.add(contents);
        prev[area] = group;
      }

      return prev;
    }, {});
  }
}