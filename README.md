### NodeJS script to combine multi SVG files into one to help with sprite creation

TODO: Use naming convention for files, *-hov, *-sel, *-sel, *-hov

TODO: Exclude Include options or config file to identify specifics

TODO: Generate CSS file for reference (Maybe SCSS option)

TODO: DONE: ~~Generate a packed SVG file~~

TODO: DONE: ~~Generate HTML example file for easy viewing~~

### Usage

Needs NodeJS and it's package manager Npm

 - Setup `npm install`
 - Test `npm test`


Example command

```bash
svg-css-compiler <location> --prefix="/assets/icons"
```

Output then move, I would normally have this as a .sh script in the app's root dir for quick access
``` bash
svg-css-compiler -i ./path/ --prefix-uri xyzzy/icons/ --stdout > ./path/_sprites.scss
mv ./__sprites.svg app/assets/images/xyzzy/icons/__sprites.svg

```

#### Options

 - `-i --input [string]` input directory
 - `-o --output [string]` output sprite to (default ./sprite.svg)
 - `-h --html [string]` output html to (default ./sprites.html)
 - `-c --css [type]` output css to (default ./sprites.css)
 - `-v --verbose` verbose
 - `--stdout` output to standard output
 - `--prefix-uri [string]` The directory location for the URI i.e </assets/icons/>file.svg
 - `--prefix-sprite-uri [string]` The directory location for the sprite URI