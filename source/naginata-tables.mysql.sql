
CREATE TABLE 'mdrnzr_client' (
  'id' mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  'useragent' varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'navigator.userAgent',
  'flash' varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT '$.flash.version.string',
  'created' int(10) unsigned NOT NULL COMMENT 'Unix timestamp when the data was received',
  'address' varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  'modernizr' varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Version of the Modernizr library',
  PRIMARY KEY ('id')
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE 'mdrnzr_key' (
  'id' smallint(4) unsigned NOT NULL AUTO_INCREMENT,
  'title' varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'video.mp4 and other features tested against with the Modernizr',
  PRIMARY KEY ('id'),
  UNIQUE KEY 'title' ('title')
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Key names of the Modernizr  statistics' AUTO_INCREMENT=1 ;


CREATE TABLE 'mdrnzr_value' (
  'id' mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  'key_id' mediumint(6) unsigned NOT NULL COMMENT 'Id of the key, such as video.mp4 which is a feature tested',
  'client_id' mediumint(7) unsigned NOT NULL COMMENT 'Client id of the given user agent that was tested against this feature',
  'hasthis' varchar(120) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Value such as true, false or possibly. Might also be empty string',
  PRIMARY KEY ('id'),
  KEY 'key_id' ('key_id','client_id')
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
