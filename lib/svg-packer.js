'use strict';

const classes = require('./svg-group');

// Used by SvgGroup
module.exports.SvgPacker = class SvgPacker {

  constructor(){}

  accept(svgGroup){

    // Avoid packing again. Would break because we'll be trying to run methods
    // that were only for SvgFile and not SvgGroup.
    if(svgGroup.wasPacked) return;

    // Sort the Files based on area
    svgGroup.sort(this._areaSort, 'area'); 

    // Break the files into groups based on the same size.
    this._groupBy(svgGroup, 'areaId');

    svgGroup.wasPacked = true;
  }

  // Bigger to smaller
  _areaSort(a, b){
    if(b.area() < a.area()) return -1;
    if(b.area() > a.area()) return +1;
    return 0;
  }

  // If item is not there place as an individual
  _groupBy(ary, meth){

    const result = ary.reduce((prev, cur)=>{

      const area     = cur[meth]();
      const contents = prev[area];

      // If nil, if Array, else it's a single file and add the group.
      if(!contents) {
        prev[area] = cur;
      } else if(contents instanceof Array){
        contents.push(cur);
      } else {
        const group = new classes.SvgGroup;
        group.add(contents);
        prev[area] = group;
      }

      return prev;
    }, {});

    // Clear out
    ary.splice(0, ary.length);

    // Add new
    for(var i in result) ary.add(result[i]);
  }
}