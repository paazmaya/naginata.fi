# naginata.fi

A web site in Finland for an ancient martial art from Japan.

All the code is under Creative Commons License - Attribution & Share Alike (http://creativecommons.org/licenses/by-sa/3.0/).
Full legal text available in `LICENSE.md`.

[![Dependency Status](https://gemnasium.com/paazmaya/naginata.fi.png)](https://gemnasium.com/paazmaya/naginata.fi)
[![Build Status](https://travis-ci.org/paazmaya/naginata.fi.png)](https://travis-ci.org/paazmaya/naginata.fi)
[![Coverage Status](https://coveralls.io/repos/paazmaya/naginata.fi/badge.png)](https://coveralls.io/r/paazmaya/naginata.fi)
[![Code Climate](https://codeclimate.com/github/paazmaya/naginata.fi.png)](https://codeclimate.com/github/paazmaya/naginata.fi)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/paazmaya/naginata.fi/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## About the martial art

Naginata is a weapon made of a long wooden stick on which a curved blade is attached.

The art of using this weapon is often called simply as Naginata, but more accurately
it can be called as Atarashii Naginata, in the case of the post-Meiji era standarsised
version.

The method of using naginata as a weapon has existed much longer and some around 500 styles
have existed in the past.

Today these are still some ten active style, of which most of them contain other weapons
aside using just a naginata. In any case in these styles naginata is used against a sword.

This website will focus on the following two:

 * Atarashii Naginatado (http://naginata.jp/)
 * Jikishinkageryu Naginatajutsu (http://www.jikishin-naginata.jp/)

## About this software project

The main reason for this website and this Github project is to learn to use the given
technologies and to promote the martial art.

The domain, `naginata.fi` is privately registered to Jukka Paasonen.

Leena Lecklin was kind enough to draw the `naginata-bogu-chudan-artwork-lecklin.png` picture used in
_Atarashii Naginata_ page.

Contributors are welcome.

[JetBrains](http://www.jetbrains.com/) has kindly provided this project with an open source license for
[PhpStorm IDE](http://www.jetbrains.com/phpstorm/).
![Developed with JetBrains PhpStorm](http://www.jetbrains.com/phpstorm/documentation/phpstorm_banners/phpstorm1/phpstorm125x37_white.gif)

## Technologies

 * JavaScript for the front and the back ends, more about it below
 * HTML5 for markup (http://developers.whatwg.org/)
 * CSS3 for styling (http://www.css3.info/modules/)
 * Local Storage replacing browser cookies (http://www.w3.org/TR/webstorage/)
 * Google Web Fonts (http://www.google.com/fonts)
 * Google Analytics
 * Deployment to Heroku, Nodejitsu and Openshift. Final decision of which to use based on perceived speed vs price

### [Node.js](http://nodejs.org "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications")

 * [NPM](https://npmjs.org/ "Node Packaged Modules")
 * `npm install`

### [Bower](http://bower.io/ "Bower is a package manager for the web")

 * `bower install`

### [Grunt](http://gruntjs.com/ "The JavaScript Task Runner")

 * Both JavaScript and CSS files are combined to a single file, minified and finally compressed.
 * `grunt minify`

### [Jade](http://jade-lang.com/ "node templating language")

 * Single index template done in Jade

### [Express.js](http://expressjs.com/ "web application framework for node")

 * Runs the site
 
### [SPDY](https://github.com/indutny/node-spdy "SPDY Server for node.js")

 * Runs the site with better network usage

### [jQuery](http://jquery.com/ "New wave JavaScript")

 * Available via Bower

### [Colorbox](http://jacklmoore.com/colorbox/ "A lightweight customizable lightbox plugin for jQuery")

 * jQuery plugin "Colorbox" used for opening content in same page
 * Available via Bower

### [Markdown](http://daringfireball.net/projects/markdown/ "Markdown is a text-to-HTML conversion tool for web writers")

All of the page contents are stored as Markdown formatter text files, under the `content` directory.

Markdown is converted to HTML via `marked` plugin and the passed to `jade` template.

Markdown files can be converted to PDF files, for example with [_pandoc_](http://johnmacfarlane.net/pandoc/),
as shown below.

```sh
pandoc -V geometry:margin=0.5in -o grading-rules-english.md grading-rules-english.pdf
```

### [JSON](http://www.json.org/ "JSON (JavaScript Object Notation) is a lightweight data-interchange format")

 * JSON used as a data format for configuration

### [Jasmine](http://pivotal.github.io/jasmine/ "Jasmine is a behavior-driven development framework for testing JavaScript code")

 * Unit tests, run on every commit at Travis CI
 * `npm run test`
 * http://about.travis-ci.org/docs/user/languages/javascript-with-nodejs/

### [Karma](http://karma-runner.github.io "Spectacular Test Runner for JavaScript")

 * Code coverage, results pushed to Coveralls.io
 * `npm run coveralls`

## Other notes

 * Speed study (http://blog.chromium.org/2010/07/do-you-know-how-slow-your-web-page-is.html)
 * Sitespeed.io, `./sitespeed.io -u http://naginata.fi -o csv -k true`
 * Keen.IO for data analytics
 * https://github.com/ktsashes/fruitjs
 * phantomas and photobox for testing

## [TODO](https://github.com/paazmaya/naginata.fi/issues "issues")

 * Translations for application strings, issues 1 and 2
 * Jasmine unit tests, for what ever little testable things there are, issue 3 and 4 for coverage
 * Facebook liking and related, https://developers.facebook.com/tools/debug/og/object?q=naginata.fi

## History

Versions before 0.4.0 were using PHP as the backend and content editing was done at the site, after
OpenID based login. Content was stored as HTML5 in MySQL database.

From version 0.4.0 onward, the site is running with Node.js and thus JavaScript as the backend.
Content is at the source code repository in text files in Markdown format.

PHP version was made to match the same simplified functionality as the Node.js counterpart in 0.4.1.
