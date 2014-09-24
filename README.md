# naginata.fi

> A web site in Finland for an ancient martial art from Japan.

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
it can be called as Atarashii Naginata, in the case of the post-Meiji era standardised
version.

The method of using naginata as a weapon has existed much longer and some around 500 styles
have existed in the past.

Today these are still some ten active style, of which most of them contain other weapons
aside using just a naginata. In any case in these styles naginata is used against a sword.

This website will focus on the following two:

 * Atarashii Naginata (http://naginata.jp/)
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
 * Deployed to Heroku (http://heroku.com/)

List of software used for making `naginata.fi` possible:

 * [Bower](http://bower.io/ "Bower is a package manager for the web")
 * [Colorbox](http://jacklmoore.com/colorbox/ "A lightweight customizable lightbox plugin for jQuery")
 * [ESLint](http://eslint.org/ "The pluggable linting utility for JavaScript")
 * [Express.js](http://expressjs.com/ "web application framework for node")
 * [Grunt](http://gruntjs.com/ "The JavaScript Task Runner")
 * [JSON](http://www.json.org/ "JSON (JavaScript Object Notation) is a lightweight data-interchange format")
 * [Jade](http://jade-lang.com/ "node templating language")
 * [Jasmine](http://pivotal.github.io/jasmine/ "Jasmine is a behavior-driven development framework for testing JavaScript code")
 * [Karma](http://karma-runner.github.io "Spectacular Test Runner for JavaScript")
 * [Markdown](http://daringfireball.net/projects/markdown/ "Markdown is a text-to-HTML conversion tool for web writers")
 * [Node.js](http://nodejs.org "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications")
 * [Phantomas](http://macbre.github.io/phantomas/ "PhantomJS-based web performance metrics collector and monitoring tool")
 * [SPDY](https://github.com/indutny/node-spdy "SPDY Server for node.js")
 * [Sitespeed.io](http://sitespeed.io "Analyze your website speed and performance")
 * [jQuery](http://jquery.com/ "New wave JavaScript")
 * [photobox](https://github.com/stefanjudis/photobox "Module to create screenshots of your site and check if the layout has changed")
 * [uCSS](https://github.com/operasoftware/ucss "uCSS is made for crawling (large) websites to find unused CSS selectors")


## Installation

```sh
npm install
bower install
grunt
```

## Testing

Unit tests for both front end and back end are using Jasmine and for code coverage Istanbul.

```sh
grunt test
npm run coveralls
```

Web performance tests are done with...

```sh
sitespeed.io -u http://naginata.fi -k true -d 2

gem install wbench
wbench -n http://naginata.fi > wbench.md
```

Style coverage is measured with several tools:

* https://github.com/katiefenn/parker

```sh
npm install -g ucss
ucss

npm install -g stylestats
stylestats -t html public_html/css/main.css > stylestats.html

npm install -g parker
parker public_html/css/main.css > parker.md
```

Also [nodemon](https://github.com/remy/nodemon/ "Monitor for any changes in your node.js application and automatically restart the server"):

```sh
npm install -g nodemon
nodemon server.js
```

### Tests statistics are available

* [paazmaya.github.io/naginata.fi/photobox](http://paazmaya.github.io/naginata.fi/photobox)
* [paazmaya.github.io/naginata.fi/phantomas](http://paazmaya.github.io/naginata.fi/phantomas)
* [paazmaya.github.io/naginata.fi/sitespeed](http://paazmaya.github.io/naginata.fi/sitespeed)
* [paazmaya.github.io/naginata.fi/stylestats.html](http://paazmaya.github.io/naginata.fi/stylestats.html)
* [paazmaya.github.io/naginata.fi/wbench.md](http://paazmaya.github.io/naginata.fi/wbench.md)
* [paazmaya.github.io/naginata.fi/parker.md](http://paazmaya.github.io/naginata.fi/parker.md)

## Editing content

Please create a pull request, which only touches the Markdown files under `content/` and/or `page-data.json` file.

The existing Markdown files can be exported as PDF, for example with [_pandoc_](http://johnmacfarlane.net/pandoc/):

```sh
pandoc -V geometry:margin=0.5in -o content/en/grading-rules.md grading-rules-english.pdf
```

## Other notes

 * Speed study (http://blog.chromium.org/2010/07/do-you-know-how-slow-your-web-page-is.html)
 * https://github.com/ktsashes/fruitjs
 * `heroku config:set npm_config_registry=http://registry.npmjs.eu`

## [TODO](https://github.com/paazmaya/naginata.fi/issues "issues")

 * Facebook liking and related, https://developers.facebook.com/tools/debug/og/object?q=naginata.fi
 * Further CSP tuning, https://www.owasp.org/index.php/Content_Security_Policy

## History

Versions before 0.4.0 were using PHP as the backend and content editing was done at the site, after
OpenID based login. Content was stored as HTML5 in MySQL database.

From version 0.4.0 onward, the site is running with Node.js and thus JavaScript as the backend.
Content is at the source code repository in text files in Markdown format.

PHP version was made to match the same simplified functionality as the Node.js counterpart in 0.4.1.

Around the release of 0.6.0, the actual `naginata.fi` domain was moved to Heroku and served from there with Node.js.
