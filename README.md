# naginata.fi

A web site in Finland for an ancient martial art from Japan.

All the code is under Creative Commons License - Attribution & Share Alike (http://creativecommons.org/licenses/by-sa/3.0/).
Full legal text available in `LICENSE.md`.

[![Dependency Status](https://gemnasium.com/paazmaya/naginata.fi.png)](https://gemnasium.com/paazmaya/naginata.fi)

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

### [Node.js](http://nodejs.org "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications")

* [NPM](https://npmjs.org/ "Node Packaged Modules")

### [Bower](http://bower.io/ "Bower is a package manager for the web")

### [Grunt](http://gruntjs.com/ "The JavaScript Task Runner")

 * Both JavaScript and CSS files are combined to a single file, minified and finally compressed.

### [Jade](http://jade-lang.com/ "node templating language")

### [Express.js](http://expressjs.com/ "web application framework for node")

### [jQuery](http://jquery.com/ "New wave JavaScript")

### [Colorbox](http://jacklmoore.com/colorbox/ "A lightweight customizable lightbox plugin for jQuery")

 * jQuery plugin "Colorbox" used for opening content in same page


### [Markdown](http://daringfireball.net/projects/markdown/ "Markdown is a text-to-HTML conversion tool for web writers")


### [JSON](http://www.json.org/ "JSON (JavaScript Object Notation) is a lightweight data-interchange format")

 * JSON used as a data format for configuration


## Other notes

 * Speed study (http://blog.chromium.org/2010/07/do-you-know-how-slow-your-web-page-is.html)


## Grading requirements for printing

The **Finnish Kendo Association - Naginata Grading Rules** are included in
this repository as Markdown files. In order to print those, they should
be converted to PDF files first.
[This can be achieved with _pandoc_](http://johnmacfarlane.net/pandoc/).

```sh
pandoc -V geometry:margin=0.5in -o grading-rules-english.md grading-rules-english.pdf
```

## TODO

 * Translations for application strings
 * Configuration of `language_TERRITORY`
 * Separate handling per page type, not all are simple articles
 * Facebook liking and related, https://developers.facebook.com/tools/debug/og/object?q=naginata.fi
