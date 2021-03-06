/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */


/**
 * Flip ahead browsing: prev, next
 * @param {array} pages List of available page objects in the current language
 * @param {object} current Currently viewed page object
 * @returns {array} List of two objects to be used as meta element data
 */
module.exports = function flipAheadLinks(pages, current) {
  const index = pages.indexOf(current);
  const prev = index > 0 ?
    index - 1 :
    pages.length - 1;
  const next = index < pages.length - 1 ?
    index + 1 :
    0;

  return [
    {
      rel: 'next',
      url: pages[next].url
    },
    {
      rel: 'prev',
      url: pages[prev].url
    }
  ];
};
