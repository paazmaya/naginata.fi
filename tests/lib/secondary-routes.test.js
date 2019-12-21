/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Secondary routes', function() {
  const secondaryRoutes = require('../../lib/secondary-routes');

  it('Sitemap is called', function(){

    const req = {};
    const res = {
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

    expect(res.set).toHaveBeenCalledWith({
      'Content-type': 'application/xml'
    });
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mostRecentCall.args[0]).toEqual('sitemap');
    expect(typeof res.render.mostRecentCall.args[2]).toEqual('function');
    expect(res.send).toHaveBeenCalledWith('hello');
  });

  it('Sitemap should get error', function(){

    const req = {};
    const res = {
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

    expect(res.set).toHaveBeenCalledWith({
      'Content-type': 'application/xml'
    });
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mostRecentCall.args[0]).toEqual('sitemap');
    expect(typeof res.render.mostRecentCall.args[2]).toEqual('function');
    expect(res.send).toHaveBeenCalled();
  });

  it('Get all post addresses for removing www', function(){
    const req = {
      hostname: 'www.naginata.fi',
      protocol: 'http',
      originalUrl: '/hoplaa'
    };
    const res = {
      redirect: function () {}
    };
    const walking = {
      next: function () {}
    };
    spyOn(res, 'redirect');
    spyOn(walking, 'next');

    const url = req.protocol + '://' + req.hostname.replace(/^www\./, '') + req.originalUrl;

    secondaryRoutes.appGetAll(req, res, walking.next);

    expect(walking.next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(url);
  });

  it('Get all post addresses when there is no www', function(){
    const req = {
      hostname: 'naginata.fi',
      protocol: 'http',
      originalUrl: '/hoplaa'
    };
    const res = {
      redirect: function () {}
    };
    const walking = {
      next: function () {}
    };
    spyOn(res, 'redirect');
    spyOn(walking, 'next');

    secondaryRoutes.appGetAll(req, res, walking.next);

    expect(walking.next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
