/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */


/**
 * Facebook Open Graph Meta data.
 * @param {Object} page Current page meta data
 * @param {Object} fb Facebook application meta
 * @returns {Array} List of meta data objects to be inserted in head element
 */
module.exports = function facebookMeta(page, fb) {
  // property, name
  const meta = [
    // http://ogp.me/
    {
      property: 'og:title',
      content: page.title
    },
    {
      property: 'og:description',
      content: page.description
    },
    {
      property: 'og:type',
      content: 'sports_team'
    },
    // All the images referenced by og:image must be at least 200px in both dimensions.
    {
      property: 'og:image',
      content: '/img/logo-200x200.png'
    },
    {
      property: 'og:url',
      content: 'https://naginata.fi' + page.url
    },
    {
      property: 'og:site_name',
      content: page.titlesuffix
    },
    {
      property: 'og:locale',
      content: 'fi_FI'
    }, // language_TERRITORY
    {
      property: 'og:locale:alternate',
      content: 'en_GB'
    },
    {
      property: 'og:locale:alternate',
      content: 'ja_JP'
    },
    {
      property: 'og:country-name',
      content: 'Finland'
    },
    // https://developers.facebook.com/docs/opengraph/
    // A Facebook Platform application ID that administers this page.
    {
      property: 'fb:app_id',
      content: fb.app_id
    },
    {
      property: 'fb:admins',
      content: fb.admins
    }
  ];

  return meta;
};
