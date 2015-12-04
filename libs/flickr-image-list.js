/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs'),
  path = require('path');


// If any of the files in 'content/*/*.md' has changed, update the whole cache.
var regex = new RegExp('\\((http:\\/\\/farm\\d+\\.static\\.?flickr\\.com\\S+\\_m.jpg)\\)', 'g');

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
 * Search for Markdown files and find any images used in them.
 * @param {string} dirpath Directory path to be searched
 * @returns {array} List of images found
 */
var findImages = function findImages(dirpath) {
  var list = [];
  var files = fs.readdirSync(dirpath);

  // Read only Markdown files
  files = files.filter(function filterMd(file) {
    return file.split('.').pop() === 'md';
  });

  files.forEach(function eachFile(file) {
    var filepath = path.join(dirpath, file);
    var content = fs.readFileSync(filepath, {
      encoding: 'utf8'
    });

    var matches;
    while ((matches = regex.exec(content)) !== null) {
      list.push(matches[1]);
    }
  });
  return list;
};

/**
 * Iterate all pages for the current language and get a list of unique Flick images.
 * @returns {Array.<string>} List of images
 */
module.exports = function flickrImageList() {

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
    var parentDir = path.join(dir, directory);
    images = images.concat(findImages(parentDir));
  });

  images = images.filter(filterDuplicate);

  return images;
};
