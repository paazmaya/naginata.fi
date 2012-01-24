
CREATE TABLE mdrnzr_client (
  id mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  useragent varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'navigator.userAgent',
  flash varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT '$.flash.version.string',
  created int(10) unsigned NOT NULL COMMENT 'Unix timestamp when the data was received',
  address varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'IP address of the user',
  modernizr varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Version of the Modernizr library',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE mdrnzr_key (
  id smallint(4) unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'video.mp4 and other features tested against with the Modernizr',
  PRIMARY KEY (id),
  UNIQUE KEY title (title)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Key names of the Modernizr  statistics' AUTO_INCREMENT=1 ;


CREATE TABLE mdrnzr_value (
  id mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  key_id mediumint(6) unsigned NOT NULL COMMENT 'Id of the key, such as video.mp4 which is a feature tested',
  client_id mediumint(7) unsigned NOT NULL COMMENT 'Client id of the given user agent that was tested against this feature',
  hasthis varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Value such as true, false or possibly. Might also be empty string',
  PRIMARY KEY (id),
  KEY key_id (key_id,client_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE naginata_page (
  id mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  url varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT 'URL of the page, such as /',
  header varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT '',
  title varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT '',
  description text COLLATE utf8_unicode_ci NOT NULL COMMENT 'Descriptions meta data. Shown also in header',
  lang varchar(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'fi' COMMENT 'Language code, two characters',
  weight tinyint(2) NOT NULL DEFAULT '0' COMMENT 'Hint for ascending order',
  PRIMARY KEY (id),
  KEY "title" ("title"),
  KEY "weight" ("weight")
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE naginata_article (
  id mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  page_id mediumint(6) unsigned NOT NULL COMMENT 'Foreign key of naginata_page',
  content text COLLATE utf8_unicode_ci NOT NULL COMMENT 'HTML5 markup to be placed inside article',
  modified int(10) NOT NULL COMMENT 'Timestamp when this content was modified',
  email varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Email address of the user who modified this version',
  published tinyint(1) NOT NULL COMMENT 'Is this version of the content public',
  PRIMARY KEY (id),
  KEY page_id (page_id),
  KEY published (published)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;






