/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Facebook OpenGraph crawler specific meta data', function() {
  const facebookMeta = require('../../libs/facebook-meta');

  const page = {
    url: '/en/koryu',
    header: 'Jikishinkageryu Naginatajutsu',
    title: 'Koryu',
    description: 'Literally koryu means old school. While related to naginata, it stands for the classical old schools which were using the weapon in their system.'
  };
  const fb = {
    app_id: '8060948243',
    admins: 'paazmaya'
  };

  it('Facebook specific metadata is returned', function() {
    const output = facebookMeta(page, fb);

    output.forEach(function (item) {
      if (item.property === 'fb:app_id') {
        expect(item.content).toBe(fb.app_id);
      }
      else if (item.property === 'fb:admins') {
        expect(item.content).toBe(fb.admins);
      }
      else if (item.property === 'og:description') {
        expect(item.content).toBe(page.description);
      }
      else if (item.property === 'og:title') {
        expect(item.content).toBe(page.title);
      }
      else if (item.property === 'og:url') {
        expect(item.content).toBe('http://naginata.fi' + page.url);
      }
    });
  });

});
