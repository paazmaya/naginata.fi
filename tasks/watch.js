/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */


module.exports = {
  scripts: {
    files: ['public_html/js/sendanmaki.js', '*.js'],
    tasks: ['uglify'],
    options: {
      interrupt: true
    }
  },
  styles: {
    files: ['public_html/css/main.css'],
    tasks: ['concat', 'postcss']
  }
};
