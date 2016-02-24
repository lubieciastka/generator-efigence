
## Install

```
$ npm install -g generator-efigence
```

// if you don't have:

```
$ npm install -g yo
$ npm install -g gulp
```


## Run

```
$ yo --help // list of all generators
$ yo efigence
$ cd project_name
$ gulp
```

## General description

```
Please keep in mind that this is still WiP.
```

TL;DR : Efigence.com project generator.

TL;R : Efigence.com project generator, that generates full development environment, with all internal good practicies included. Currently supports :

- gulp
- foundation
- jasmine
- babel
- sass
- connect
- yuidoc
- csscomb
- jslint
- kss


## Gulp tasks

```
$ gulp yuidoc
$ gulp jasmine
$ gulp vendors
$ gulp html
$ gulp img
$ gulp fonts
$ gulp kss
$ gulp scripts
$ gulp styles
$ gulp zip
```

## Current todo list

- [in progress] help
- [in progress] Foundation add posibility to chose 5 vs 6
- [DONE] babel + babel-preset-es2015
- [DONE partially] KSS example
- [DONE] jsDoc add + [TODO] example
- [DONE] More comments/ explanations
- [DONE] GULP jslint
- [DONE] GULP css packages cleanup
- [DONE] GULP ZIP ?
- [DONE] GULP csscomb

## Future plans

- WCAG Support
- Image optimizer
- Problems with gulp-sass on some linux env ( try to use gulp-ruby-sass instead )
- More tests examples
- GULP Image Optimization
- Google Material Design
- Support for angular 1.* / 2.*
- Support for react
- GULP connect alternative - BrowserSync ?
- GULP PROD/ DEV option
- Global dependcies ? ( requireg ? global-npm? )
- NPM vs BOWER ?
