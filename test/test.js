var MainApp = require('../lib/main');
var assert  = require('assert');

describe('svn-css-combiner', _=>{
  
  var app;

  before(()=>{
    app = new MainApp('path');
  });

  it('Should check #files', ()=>{
    assert(!app.files.length);
    app.add('./');
    //console.info('files', app.files);
    //assert(app.files.length);
  });
});