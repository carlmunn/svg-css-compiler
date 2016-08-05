const path    = require('path');

const MainApp = require('../lib/main');
const assert  = require('assert');

function basePath(loc) {
  return path.join(path.dirname(__filename), loc);
}

describe('Test with without fresh load', _=>{
  
  var mainSVG;

  before(()=>{
    mainSVG = new MainApp('path');
  });

  it('Should check #files', ()=>{
    assert(!mainSVG.files().length);
    mainSVG.add(basePath('files'));
    assert.equal(mainSVG.files().length, 5);
  });

  it('should check #content', ()=>{
    mainSVG.add(basePath('files'));
    assert(mainSVG.files(0).content.length > 10);
  });

  it('should check #dom', ()=>{
    mainSVG.add(basePath('files'));
    assert(mainSVG.files(0).dom instanceof Object);
  });

  it('should check the viewBoxes', ()=>{
    mainSVG.add(basePath('files'));
    assert.equal(mainSVG.files(0).viewBox(), '0 0 36 33');
  });

  it('should check the viewBoxes', ()=>{
    mainSVG.add(basePath('files'));

    const pos = mainSVG.files(0).position();

    assert.equal(pos.x, 0);
    assert.equal(pos.y, 0);
    assert.equal(pos.width, 36);
    assert.equal(pos.height, 33);
  });
});

describe('Test with fresh load', _=>{

  beforeEach(()=>{
    mainSVG = new MainApp('path');
  });

  it('should check the SVG total height/width', ()=>{
    mainSVG.add(basePath('files'));

    assert.equal(mainSVG.height(), 161);
    assert.equal(mainSVG.width(), 164);
  });

  it.only('should check the file symbol element', ()=>{
    mainSVG.add(basePath('files'));

    console.info('====>', mainSVG.files(0)._svgSymbol())

    //assert.equal(mainSVG.height(), 161);
    //assert.equal(mainSVG.width(), 164);
  });

  it.only('should check the file use element', ()=>{
    mainSVG.add(basePath('files'));

    console.info('====>', mainSVG.files(0)._svgUse())

    //assert.equal(mainSVG.height(), 161);
    //assert.equal(mainSVG.width(), 164);
  });
});