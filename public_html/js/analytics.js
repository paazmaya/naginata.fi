/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

(function analytics(T, a, n, t, o, u) {
  T.GoogleAnalyticsObject = t;
  T[t] || (T[t] = function inliner() {
    (T[t].q = T[t].q || []).push(arguments);
  });
  T[t].l = +new Date();
  o = a.createElement(n);
  u = a.getElementsByTagName(n)[0];
  o.src = '//www.google-analytics.com/analytics.js';
  u.parentNode.insertBefore(o, u);
})(this, document, 'script', 'ga');

ga('create', 'UA-2643697-14', 'naginata.fi');
ga('require', 'displayfeatures');
ga('send', 'pageview');
