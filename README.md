### NodeJS script to combine multi SVG files into one to help with sprite creation

TODO: use a naming convention
-hov
-sel
-sel-hov

~~Generate a packed SVG file~~

Generate CSS file for reference (Maybe SCSS option)

~~Generate HTML example file for easy viewing~~

### Usage

Needs NodeJS and it's package manager Npm

 - Setup `npm install`
 - Test `npm test`


Example command

```bash
svg-css-compiler <location> --postfix="/assets/icons"
```

#### Options

 - `-i --input [string]` input directory
 - `-o --output [string]` output sprite to (default ./sprite.svg)
 - `-h --html [string]` output html to (default ./sprites.html)
 - `-c --css [type]` output css to (default ./sprites.css)
 - `-v --verbose` verbose
 - `--stdout` output to standard output
 - `--postfix-uri [string]` The directory location for the URI i.e </assets/icons/>file.svg
