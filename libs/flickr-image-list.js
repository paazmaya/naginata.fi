/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');
var path = require('path');


/**
 * Filter an array so it has no duplicates
 * @param {string} value Current value that is being iterated
 * @param {number} index Current value index
 * @param {array} list The array that is being filtered
 * @returns {bool} The given item is the last found
 */
var filterDuplicate = function filterDuplicate(value, index, list) {
  return list.lastIndexOf(value) === index;
};

/**
 * Iterate all pages for the current language and get a list of unique Flick images.
 * @returns {array.<string>} List of images
 */
module.exports = function flickrImageList() {
  // If any of the files in 'content/*/*.md' has changed, update the whole cache.
  var regex = new RegExp('\\((http:\\/\\/farm\\d+\\.static\\.?flickr\\.com\\S+\\_m.jpg)\\)', 'g');

  // Loop all Markdown files under content/*/
  var dir = path.join(__dirname, '../content/');
  var directories = fs.readdirSync(dir);

  /**
   * Check if the given file is a directory.
   * @param {string} item File name
   * @returns {bool} File is directory
   */
  directories = directories.filter(function filterDirectory(item) {
    var stats = fs.statSync(dir + item);
    return stats.isDirectory();
  });

  var images = []; // thumbnails of Flickr images

  // Read their contents
  directories.forEach(function eachDir(directory) {
    var parentDir = dir + directory;
    var files = fs.readdirSync(parentDir);
    files.forEach(function eachFile(file) {
      if (file.split('.').pop() === 'md') {
        var path = parentDir + '/' + file;
        var content = fs.readFileSync(path, {
          encoding: 'utf8'
        });

        var matches;
        while ((matches = regex.exec(content)) !== null) {
          images.push(matches[1]);
        }
      }
    });
  });

  images = images.filter(filterDuplicate);

  return images;
};
