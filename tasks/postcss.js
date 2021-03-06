/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */


module.exports = {
  options: {
    processors: [
      require('autoprefixer'),
      require('csswring')
    ]
  },
  css: {
    src: 'public_html/css/main.css',
    dest: 'public_html/css/naginata.min.css'
  }
};
