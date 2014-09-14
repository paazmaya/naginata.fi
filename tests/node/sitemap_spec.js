/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';
var fs = require('fs');

describe('Sitemap XML creation', function() {
  var sitemap = require('../../libs/sitemap');

  var pages = [
    {
      "fi": {
        "url": "/fi",
        "header": "Ajankohtaista",
        "title": "Ajankohtaista",
        "description": "Ajankohtaista ja historiallistakin tietoa Naginata-aseella harjoitteluun liittyen. Tähän kuuluvat muun muassa lajit ja tyylit kuten Atarashii Naginatado ja Jikishinkageryu Naginatajutsu"
      },
      "en": {
        "url": "/en",
        "header": "News",
        "title": "News",
        "description": "Latest events and news in the area of Finnish Naginata, with International coverage"
      }
    },
    {
      "fi": {
        "url": "/fi/naginata",
        "header": "Atarashii Naginata",
        "title": "Naginata",
        "description": "Uuden ja yhdenmukaisen naginatan harjoittelu perustuu kahden naginatan kohtaamiseen, joko suojavarusteiden kanssa tai ilman. Perustekniikat, ennaltamäärätyt parihajoitukset ja vapaat ottelut luovat laajan mutta yhtenäisen kokonaisuuden lajissa, jota harrastaa Japanissa pääasiassa naiset, kun Japanin ulkopuolella sekä naiset että miehet"
      },
      "en": {
        "url": "/en/naginata",
        "header": "Atarashii Naginata",
        "title": "Naginata",
        "description": "The modern Japanese martial art Atarashii Naginata is about using a long weapon"
      }
    }
  ];
  var enabledLanguages = null;

  it('Two languages with two pages counts for four', function() {
    enabledLanguages = ["fi", "en"];

    var output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(4);
  });

  it('Only English', function() {
    enabledLanguages = ["en"];

    var output = sitemap(pages, enabledLanguages);
    expect(output.length).toBe(2);
  });

});
