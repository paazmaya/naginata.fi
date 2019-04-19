# naginata.fi

> A web site in Finland for an ancient martial art from Japan.

All the code is under the [Creative Commons Attribution-ShareAlike 4.0 International Public License](https://creativecommons.org/licenses/by-sa/4.0/).
Full legal text also available in [`LICENSE` file](LICENSE).

[![dependencies Status](https://david-dm.org/paazmaya/naginata.fi/status.svg)](https://david-dm.org/paazmaya/naginata.fi)
[![Build Status](https://travis-ci.org/paazmaya/naginata.fi.svg?branch=master)](https://travis-ci.org/paazmaya/naginata.fi)
[![Built with Grunt](http://img.shields.io/badge/Grunt-1.0-blue.svg?style=flat-square)](http://gruntjs.com/)
![Visual Regression Status](https://api.ghostinspector.com/v1/suites/5408c0312f4dd6df5ae50101/status-badge)
[![Netlify Status](https://api.netlify.com/api/v1/badges/1c6a708d-5ee5-4cd2-8e66-8cbdbfaa454d/deploy-status)](https://app.netlify.com/sites/naginata-finland/deploys)

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

The main reason for this website and this GitHub project is to learn to use the given
technologies and to promote the martial art.

The domain `naginata.fi` is privately registered to Jukka Paasonen.

Mari Paasonen has been kind enough to provide the Japanese translations for the content.

Leena Lecklin was kind enough to draw the `naginata-bogu-chudan-artwork-lecklin.png` picture
used in the _Atarashii Naginata_ page.

Contributors are welcome.

Any changes made to this GitHub repository, are automatically deployed to Netlify,
hence any content updates are visible via the web site almost immediately.

[![BrowserStack](./browserstack-logo.png) Cross browser testing kindly provided by BrowserStack.](https://www.browserstack.com/)

## Contributing

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://www.erikaheidi.com/blog/a-beginners-guide-to-open-source-the-best-advice-for-making-your-first-contribution/).

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm run lint`.
There should be no errors appearing after any JavaScript file changes.

## Technologies

 * JavaScript for the front and the back ends, more about it below
 * HTML5 for markup (http://developers.whatwg.org/)
 * CSS3 for styling (http://www.css3.info/modules/)
 * Local Storage replacing browser cookies (http://www.w3.org/TR/webstorage/)
 * Google Web Fonts (http://www.google.com/fonts)
 * Google Analytics
 * Deployed to Heroku (http://heroku.com/)

List of software used for making `naginata.fi` possible:

 * [Colorbox](http://jacklmoore.com/colorbox/ "A lightweight customizable lightbox plugin for jQuery")
 * [ESLint](http://eslint.org/ "The pluggable linting utility for JavaScript")
 * [Express.js](http://expressjs.com/ "web application framework for node")
 * [Grunt](http://gruntjs.com/ "The JavaScript Task Runner")
 * [Markdown](http://daringfireball.net/projects/markdown/ "Markdown is a text-to-HTML conversion tool for web writers")
 * [Node.js](http://nodejs.org "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications")
 * [Phantomas](http://macbre.github.io/phantomas/ "PhantomJS-based web performance metrics collector and monitoring tool")
 * [Sitespeed.io](http://sitespeed.io "Analyze your website speed and performance")
 * [jQuery](http://jquery.com/ "New wave JavaScript")


## Installation

```sh
npm install
npx grunt
node build.js
```

## Testing

Unit tests for back end are using Jasmine and for code coverage Istanbul.

```sh
grunt test
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

## Editing content

Please create a pull request, which only touches the Markdown files under `content/` and/or `page-data.json` file.

The existing Markdown files can be exported as PDF, for example with [_pandoc_](http://johnmacfarlane.net/pandoc/):

```sh
pandoc -V geometry:margin=0.5in -o content/en/grading-rules.md grading-rules-english.pdf
```

## Other notes

 * Speed study (http://blog.chromium.org/2010/07/do-you-know-how-slow-your-web-page-is.html)
 * https://github.com/ktsashes/fruitjs

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

In late April 2019, deployment of the site was moved to happen in Netlify, instead of Heroku, which also meant that the site is now build as a static web site.
