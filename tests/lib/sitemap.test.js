/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs');

describe('Sitemap XML creation', function() {
  const sitemap = require('../../lib/sitemap');

  const pages = [
    {
      fi: {
        url: '/fi',
        header: 'Ajankohtaista',
        title: 'Ajankohtaista',
        description: 'Ajankohtaista ja historiallistakin tietoa Naginata-aseella harjoitteluun liittyen. Tähän kuuluvat muun muassa lajit ja tyylit kuten Atarashii Naginatado ja Jikishinkageryu Naginatajutsu'
      },
      en: {
        url: '/en',
        header: 'News',
        title: 'News',
        description: 'Latest events and news in the area of Finnish Naginata, with International coverage'
      }
    },
    {
      fi: {
        url: '/fi/naginata',
        header: 'Atarashii Naginata',
        title: 'Naginata',
        description: 'Uuden ja yhdenmukaisen naginatan harjoittelu perustuu kahden naginatan kohtaamiseen, joko suojavarusteiden kanssa tai ilman. Perustekniikat, ennaltamäärätyt parihajoitukset ja vapaat ottelut luovat laajan mutta yhtenäisen kokonaisuuden lajissa, jota harrastaa Japanissa pääasiassa naiset, kun Japanin ulkopuolella sekä naiset että miehet'
      },
      en: {
        url: '/en/naginata',
        header: 'Atarashii Naginata',
        title: 'Naginata',
        description: 'The modern Japanese martial art Atarashii Naginata is about using a long weapon'
      }
    }
  ];
  let enabledLanguages = null;

  it('Two languages with two pages counts for four', function() {
    enabledLanguages = ['fi', 'en'];

    const output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(4);
  });

  it('Only English', function() {
    enabledLanguages = ['en'];

    const output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(2);
  });

  it('Has three keys', function() {
    enabledLanguages = ['en'];

    const output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(2);
    const first = output.shift();
    const keys = Object.keys(first);

    expect(keys[0]).toBe('loc');
    expect(keys[1]).toBe('lastmod');
    expect(keys[2]).toBe('changefreq');

    expect(first.changefreq).toBe('monthly');
  });

  it('Contains alternative language and itself', function() {
    enabledLanguages = ['en', 'fi'];

    const output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(4);

    const first = output[0];
    expect(first.alternates.length).toBe(2);
    expect(first.alternates[0].lang).toBe('fi');
    expect(first.alternates[1].lang).toBe('en');

    const last = output.pop();

    expect(last.alternates.length).toBe(2);
    expect(last.alternates[0].lang).toBe('fi');
    expect(last.alternates[0].href).toBe('/fi/naginata');
    expect(last.alternates[1].lang).toBe('en');
    expect(last.alternates[1].href).toBe('/en/naginata');
  });
});
