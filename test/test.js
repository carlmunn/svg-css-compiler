'use strict';

const path    = require('path');

const SvgGroup = require('../lib/svg-group').SvgGroup;
const SvgFile  = require('../lib/svg-file').SvgFile;
const Config  = require('../lib/config').Config;

const MainApp = require('../lib/main');
const assert  = require('assert');

function basePath(loc) {
  return path.join(path.dirname(__filename), loc);
}

function regexTest(str, exp) {
  assert(!!str.match(exp));
}

describe('Test with without fresh load', _=>{
  
  var mainSvg;

  before(()=>{
    mainSvg = new MainApp('path');
  });

  it('Should check #files', ()=>{
    assert(!mainSvg.files().length);
    mainSvg.add(basePath('files'));
    assert.equal(mainSvg.files().length, 8);
  });
  
  /*
  it.only('should ignore the generated sprites file', ()=>{
    assert(!mainSvg.files().length);
    mainSvg.add(basePath('files'));
    console.info(mainSvg.files())
  });
  */
  
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
  
  let mainSvg = null;

  beforeEach(()=>{
    mainSvg = new MainApp('path');
  });

  it('should check the SVG total height/width', ()=>{
    mainSvg.add(basePath('files'));

    assert.equal(mainSvg.height(), 254);
    
    // Width being the item with the largest.
    assert.equal(mainSvg.width(), 43);
  });

  it('should check the file symbol element', ()=>{
    mainSvg.add(basePath('files'));
    assert(typeof(mainSvg.files(0).symbolElement()) == 'string');
  });

  it('should check the file use element', ()=>{
    mainSvg.add(basePath('files'));
    assert(typeof(mainSvg.files(0).useElement()) == 'string');
  });

  it('should test the SVG generation', ()=>{
    mainSvg.add(basePath('files'));
    assert(typeof(mainSvg.toSvg()) == 'string');
  });

  // Will fail on non *inx systems, windows doesn't have /dev/null
  it('should test #svg', ()=>{
    mainSvg.add(basePath('files'));

    mainSvg.svgGroup.arrangeGroups();

    assert(typeof(mainSvg.toSvg()) == 'string');
  });

  it('it should remove file from SvgGroup', ()=>{
    const svgFile  = new SvgFile('./test/files/home.svg');
    const svgGroup = new SvgGroup;

    svgGroup.add(svgFile);
    assert.equal(svgGroup.length, 1);

    svgGroup.remove(svgFile);
    assert.equal(svgGroup.length, 0);
  });

  it('should test #useElement on SvgGroup', ()=>{
    const svgFile  = new SvgFile('./test/files/home.svg');
    const svgGroup = new SvgGroup;
    svgGroup.add(svgFile);
    assert(svgGroup.useElement() instanceof Array);
  })

  //describe('test Sort');

  //describe('test Group');

  it('should test having groups and files in SvgGroup');

  describe('Grouping/Sorting', ()=>{
    it('should test #calcLocations', ()=>{
      mainSvg.add(basePath('files'));

      mainSvg.svgGroup.calcLocations();

      mainSvg.toFile('test-calculation.svg');
    });
  });
});

describe('Test CSS Generation', _=>{

  var mainSvg;
  const cssBgRegex = /background:\s.*\s(\d{1,2})px\s(-\d{1,2})px;/;

  before(()=>{
    mainSvg = new MainApp({spriteName: 'sprites'});
    mainSvg.add(basePath('files'));
  });

  it('tests the #cssEntry method', ()=>{
    mainSvg.svgGroup.calcLocations();
    const str = mainSvg.files(2).cssEntry('./file.svg');
    assert(!!str.match(cssBgRegex));
  });

  it('test first CSS position', ()=>{
    
    const str = mainSvg.files(0).cssEntry('./file.svg');
    const pos = str.match(cssBgRegex).splice(1, 2);

    assert.equal(pos[0], 0);
    assert.equal(pos[1], 0);
  });

  it('test first CSS position', ()=>{
    mainSvg.svgGroup.calcLocations();
    
    const str = mainSvg.renderCss();

    // console.info(str);
    // Basic test for now
    assert(str.length > 10);
  });

  it('tests CSS generated string', ()=>{
    mainSvg.renderCss();
    
    //const str = mainSvg.toCSS();

    // console.info(str);
    // Basic test for now
    //assert(str.length > 10);
  });
  
  it('tests HTML rendering', ()=>{
    const SvgHtml = require('../lib/svg-html').SvgHtml;
    
    const svgs = [new SvgFile('./test/files/home.svg')];
    
    const htmlRender = new SvgHtml({css: 'CSS', svgs: svgs});
    
    const str = htmlRender.render();
    
    assert(str.length > 10);
  })
});

describe('Tests for SvgGroup', ()=>{

  var obj      = null;
  var filename = null;

  beforeEach(()=>{
    obj      = new SvgGroup;
    filename = 'sprite.svg';
  });

  function assert_path(_path, opts) {
    assert.equal(obj._location(filename, opts), _path);
  }

  it("checks the prefix is generated with absolute", ()=>{
    assert_path('sprite.svg', {});
  });

  it("checks the prefix with no prefixUri", ()=>{
    assert_path('sprite.svg', {relative: false});
  });

  it("checks the prefix with prefixUri", ()=>{
    assert_path('/sprefix/sprite.svg', {prefixSpriteUri: '/sprefix/', relative: false});
  });

  it("checks the prefix with prefixUri but no forward slash", ()=>{
    assert_path('sprefix/sprite.svg', {prefixSpriteUri: 'sprefix/', relative: false});
  });

  it('tests the file prefix paths', ()=>{
    const svgFile  = new SvgFile('./test/files/home.svg');
    const svgGroup = new SvgGroup;
    svgGroup.add(svgFile);

    console.info(svgGroup[0].uri)
    
    svgGroup.toScss({prefixUri: '/PREFIXED/'});
    assert.equal(svgGroup[0].uri, '/PREFIXED/home.svg')
  });

});

// describe('Tests for sprite', ()=>{

//   var mainSvg      = null;
//   //ar filename = null;

//   beforeEach(()=>{
//     mainSvg = new MainApp({spriteName: 'sprites', spriteprefixUri: 'xxx'});
//     mainSvg.add(basePath('files'));
//     // obj      = new SvgGroup;
//     // filename = 'testfile.svg';
//   });

//   function assert_path(_path, opts) {
//     console.info(mainSvg)
//     //assert.equal(obj._location(filename, opts), _path);
//   }

//   it.only('checks the sprite prefix with prefixSpriteUri', ()=>{
//     assert_path('/prefix/testfile.svg', {prefixSpriteUri: '/spritePrefix/', relative: false});
//   });
// });

describe('Tests for Config', ()=>{
  
  var mainSvg;

  it('ignores files in sprite_ignores option', ()=>{
    const config = new Config('./test/files/svg-css-compiler-config.json')
    mainSvg = new MainApp({spriteName: 'sprites', config: config});
    mainSvg.add(basePath('files'));
    assert.equal(mainSvg.files().length, 8);
  })
});
