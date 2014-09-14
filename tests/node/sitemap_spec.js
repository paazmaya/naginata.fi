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
  var pageData = {
  "languages": {
    "fi": {
      "enabled": true,
      "name": "Suomi"
    },
    "en": {
      "enabled": true,
      "name": "English"
    }
  },
  "title": {
    "fi": "Naginata Suomessa",
    "en": "Naginata Finland",
    "ja": "\u306a\u304e\u306a\u305f \u30d5\u30a3\u30f3\u30e9\u30f3\u30c9"
  },
  "pages": [
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
    },
    {
      "fi": {
        "url": "/fi/koryu",
        "header": "Jikishinkageryu Naginatajutsu",
        "title": "Koryu",
        "description": "Kirjaimellisesti käännettynä koryu tarkoittaa vanhaa koulua. Naginatan osalta koryu viittaa niihin vanhoihin kouluihin ja tyyleihin, joissa aseella harjoiteltiin."
      },
      "en": {
        "url": "/en/koryu",
        "header": "Jikishinkageryu Naginatajutsu",
        "title": "Koryu",
        "description": "Literally koryu means old school. While related to naginata, it stands for the classical old schools which were using the weapon in their system."
      }
    }
  ]
};



  it('at least few pages are listed', function() {
    var output = sitemap(pageData);
    expect(output.length).toBeGreaterThan(4);
  });

});
