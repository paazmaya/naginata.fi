/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

const APP_ID = '8060948243';
const ADMINS = 'paazmaya';

/**
 * Facebook Open Graph Meta data.
 * @returns {Array} List of meta data objects to be inserted in head element
 */
module.exports = function facebookMeta() {
  // property, name
  const meta = [
    // http://ogp.me/
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
      content: APP_ID
    },
    {
      property: 'fb:admins',
      content: ADMINS
    }
  ];

  return meta;
};
