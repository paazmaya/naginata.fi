/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Secondary routes', function() {
  var secondaryRoutes = require('../../libs/secondary-routes');

  beforeEach(function() {
    global.newrelic = {
      noticeError: function () {}
    };
  });

  it('Sitemap is called', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {};
    var res = {
      set: function () {},
      render: function (name, data, func) {
        func.call(null, null, 'hello');
      },
      send: function () {}
    };
    spyOn(res, 'set');
    spyOn(res, 'render').andCallThrough();
    spyOn(res, 'send');

    secondaryRoutes.getSitemap(req, res);

    expect(global.newrelic.noticeError).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith({'Content-type': 'application/xml'});
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mostRecentCall.args[0]).toEqual('sitemap');
    expect(typeof res.render.mostRecentCall.args[2]).toEqual('function');
    expect(res.send).toHaveBeenCalledWith('hello');
  });

  it('Sitemap should get error', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {};
    var res = {
      set: function () {},
      render: function (name, data, func) {
        func.call(null, 'this is error', 'failure');
      },
      send: function () {}
    };
    spyOn(res, 'set');
    spyOn(res, 'render').andCallThrough();
    spyOn(res, 'send');

    secondaryRoutes.getSitemap(req, res);

    expect(global.newrelic.noticeError).toHaveBeenCalledWith('sitemap', 'this is error');
    expect(res.set).toHaveBeenCalledWith({'Content-type': 'application/xml'});
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mostRecentCall.args[0]).toEqual('sitemap');
    expect(typeof res.render.mostRecentCall.args[2]).toEqual('function');
    expect(res.send).toHaveBeenCalled();
  });

  it('CSP violation report is called with empty object', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {
      body: {}
    };
    var res = {
      set: function () {},
      json: function () {}
    };
    spyOn(res, 'set');
    spyOn(res, 'json');

    secondaryRoutes.postViolation(req, res);

    expect(global.newrelic.noticeError).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledWith({'Content-type': 'application/json'});
    expect(res.json).toHaveBeenCalledWith({report: 'prosessed'});
  });

  it('CSP violation report is called with string', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {
      body: ''
    };
    var res = {
      set: function () {},
      json: function () {}
    };
    spyOn(res, 'set');
    spyOn(res, 'json');

    secondaryRoutes.postViolation(req, res);

    expect(global.newrelic.noticeError).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledWith({'Content-type': 'application/json'});
    expect(res.json).toHaveBeenCalledWith({report: 'failed'});
  });

  it('CSP violation report is called with correct report', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {
      body: {
        'csp-report': {
          'document-uri': 'http://naginata.fi/en/',
          'referrer': '',
          'source-uri': 'http://naginata.fi/css/main.css',
          'blocked-uri': 'http://naginata.com/css/style.css',
          'violated-directive': 'style-src cdn.example.com',
          'original-policy': 'default-src \'none\'; style-src cdn.example.com; report-uri /violation-report'
        }
      }
    };
    var res = {
      set: function () {},
      json: function () {}
    };
    spyOn(res, 'set');
    spyOn(res, 'json');

    secondaryRoutes.postViolation(req, res);

    expect(global.newrelic.noticeError).toHaveBeenCalled();
    expect(global.newrelic.noticeError.mostRecentCall.args[0]).toEqual('CSP-policy-violation');

    expect(res.set).toHaveBeenCalledWith({'Content-type': 'application/json'});
    expect(res.json).toHaveBeenCalledWith({report: 'prosessed'});
  });


  it('Get all post addresses for removing www', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {
      hostname: 'www.naginata.fi',
      protocol: 'http',
      originalUrl: '/hoplaa'
    };
    var res = {
      redirect: function () {}
    };
    var walking = {
      next: function () {}
    };
    spyOn(res, 'redirect');
    spyOn(walking, 'next');

    var url = req.protocol + '://' + req.hostname.replace(/^www\./, '') + req.originalUrl;

    secondaryRoutes.appGetAll(req, res, walking.next);

    expect(global.newrelic.noticeError).not.toHaveBeenCalled();

    expect(walking.next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(url);
  });

  it('Get all post addresses when there is no www', function(){
    spyOn(global.newrelic, 'noticeError');

    var req = {
      hostname: 'naginata.fi',
      protocol: 'http',
      originalUrl: '/hoplaa'
    };
    var res = {
      redirect: function () {}
    };
    var walking = {
      next: function () {}
    };
    spyOn(res, 'redirect');
    spyOn(walking, 'next');

    secondaryRoutes.appGetAll(req, res, walking.next);

    expect(global.newrelic.noticeError).not.toHaveBeenCalled();

    expect(walking.next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
