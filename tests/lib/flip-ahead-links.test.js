/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Flip ahead meta links', function() {
  const flipAheadLinks = require('../../lib/flip-ahead-links');

  const pages = [
    {
      url: '/en',
      header: 'News',
      title: 'News',
      description: 'Latest events and news in the area of Finnish Naginata, with International coverage'
    },
    {
      url: '/en/naginata',
      header: 'Atarashii Naginata',
      title: 'Naginata',
      description: 'The modern Japanese martial art Atarashii Naginata is about using a long weapon'
    },
    {
      url: '/en/koryu',
      header: 'Jikishinkageryu Naginatajutsu',
      title: 'Koryu',
      description: 'Literally koryu means old school. While related to naginata, it stands for the classical old schools which were using the weapon in their system.'
    },
    {
      url: '/en/contact',
      header: 'Contact Information',
      title: 'Contact',
      description: 'Get connected to the people who are in anyway related to the history and contents of this web site and to Naginata in Finland'
    }
  ];
  let current = null;

  it('Structure is correct', function() {
    current = pages[0];
    const output = flipAheadLinks(pages, current);
    expect(output.length).toBe(2);
    expect(output[0].rel).toBe('next');
    expect(output[1].rel).toBe('prev');
  });

  it('News is current so next is Naginata and previous is Contact', function() {
    current = pages[0];
    const output = flipAheadLinks(pages, current);

    expect(output[0].url).toBe(pages[1].url);
    expect(output[1].url).toBe(pages[3].url);
  });

  it('Koryu is current so next is Contact and previous is Naginata', function() {
    current = pages[2];
    const output = flipAheadLinks(pages, current);

    expect(output[0].url).toBe(pages[3].url);
    expect(output[1].url).toBe(pages[1].url);
  });

  it('Contact is current so next is News and previous is Koryu', function() {
    current = pages[pages.length - 1];
    const output = flipAheadLinks(pages, current);

    expect(output[0].url).toBe(pages[0].url);
    expect(output[1].url).toBe(pages[2].url);
  });

});
