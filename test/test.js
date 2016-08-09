const path    = require('path');
//const cheerio = require('cheerio');

const MainApp = require('../lib/main');
const assert  = require('assert');

function basePath(loc) {
  return path.join(path.dirname(__filename), loc);
}

describe('Test with without fresh load', _=>{
  
  var mainSvg;

  before(()=>{
    mainSvg = new MainApp('path');
  });

  it('Should check #files', ()=>{
    assert(!mainSvg.files().length);
    mainSvg.add(basePath('files'));
    assert.equal(mainSvg.files().length, 5);
  });

  it('should check for no SVG files');

  it('should check #content', ()=>{
    mainSvg.add(basePath('files'));
    assert(mainSvg.files(0).content.length > 10);
  });

  it('should check #dom', ()=>{
    mainSvg.add(basePath('files'));
    assert(mainSvg.files(0).dom instanceof Object);
  });

  it('should check the viewBoxes', ()=>{
    mainSvg.add(basePath('files'));
    assert.equal(mainSvg.files(0).viewBox(), '0 0 36 33');
  });

  it('should check the viewBoxes', ()=>{
    mainSvg.add(basePath('files'));

    const pos = mainSvg.files(0).position();

    assert.equal(pos.x, 0);
    assert.equal(pos.y, 0);
    assert.equal(pos.width, 36);
    assert.equal(pos.height, 33);
  });
});

describe('Test with fresh load', _=>{

  beforeEach(()=>{
    mainSvg = new MainApp('path');
  });

  it('should check the SVG total height/width', ()=>{
    mainSvg.add(basePath('files'));

    assert.equal(mainSvg.height(), 161);
    assert.equal(mainSvg.width(), 164);
  });

  it('should check the file symbol element', ()=>{
    mainSvg.add(basePath('files'));
    assert(typeof(mainSvg.files(0).symbolElement()) == 'string');
  });

  it('should check the file use element', ()=>{
    mainSvg.add(basePath('files'));
    assert(typeof(mainSvg.files(0).useElement()) == 'string');
  });

  it('should test #svg', ()=>{
    mainSvg.add(basePath('files'));
    mainSvg.toFile('/dev/null');
  });

  describe('test Sort');

  describe('test Group');
});