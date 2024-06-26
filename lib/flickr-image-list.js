/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

// If any of the files in 'content/*/*.md' has changed, update the whole cache.
const FLICKR_MATCHER = /(https:\/\/.+\.static\.?flickr\.com\S+\.jpg)/gu;

/**
 * Filter an array so it has no duplicates
 * @param {string} value Current value that is being iterated
 * @param {number} index Current value index
 * @param {array} list The array that is being filtered
 * @returns {bool} The given item is the last found
 */
export const filterDuplicate = function filterDuplicate(value, index, list) {
  return list.lastIndexOf(value) === index;
};

/**
 * Search for Markdown files and find any images used in them.
 * @param {string} dirpath Directory path to be searched
 * @returns {array} List of images found
 */
export const findImages = function findImages(dirpath) {
  const list = [];
  let files = fs.readdirSync(dirpath);

  // Read only Markdown files
  files = files.filter(function filterMd(file) {
    return file.split('.').pop() === 'md';
  });

  files.forEach(function eachFile(file) {
    const filepath = path.join(dirpath, file);
    const content = fs.readFileSync(filepath, {
      encoding: 'utf8'
    });

    let matches;
    while ((matches = FLICKR_MATCHER.exec(content)) !== null) {
      list.push(matches[1]);
    }
  });

  return list;
};

/**
 * Iterate all pages for the current language and get a list of unique Flick images.
 * @returns {Array.<string>} List of images
 */
export default function flickrImageList() {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  // Loop all Markdown files under content/*/
  const dir = path.join(__dirname, '../content/');
  let directories = fs.readdirSync(dir);

  /**
   * Check if the given file is a directory.
   * @param {string} item File name
   * @returns {bool} File is directory
   */
  directories = directories.filter(function filterDirectory(item) {
    const stats = fs.statSync(dir + item);

    return stats.isDirectory();
  });

  let images = []; // thumbnails of Flickr images

  // Read their contents
  directories.forEach(function eachDir(directory) {
    const parentDir = path.join(dir, directory);
    images = images.concat(findImages(parentDir));
  });

  images = images.filter(filterDuplicate);

  return images;
}
