
var VERSION = '20190420a';

var cacheFilesFirst = [
  '/css/naginata.min.css',
  '/favicon.ico',
  '/img/flickr_28.png',
  '/img/flickr_48.png',
  '/img/logo.png',
  '/img/naginata-bogu-chudan-artwork-lecklin.png',
  '/img/vimeo_28.png',
  '/img/vimeo_48.png',
  '/img/youtube_28.png',
  '/img/youtube_48.png',
  '/js/naginata.min.js',
  '/manifest.webmanifest'
];

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll(cacheFilesFirst);
    }).catch(function(error) {
      console.error('Getting everything in cache failed.');
      console.error(error);
    })
  );
});

// Primarily use cache but fetch from the network when not found
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      console.log('event.request', event.request);
      console.log('resp', resp);
      return resp || fetch(event.request).then(function(response) {
        if (/farm\d+\.static\.*flickr\.com/.test(event.request.url)) {
          return caches.open(VERSION).then(function(cache) {

            cache.put(event.request, response.clone());

            return response;
          });
        }
        return response;
      });
    }).catch(function(error) {
      console.error('Matching request from cache or network failed.');
      console.error(error);
    })
  );
});


// Remove any caches that are not the current
this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(list) {
      return Promise.all(list.filter(function(key) {
        return key !== VERSION;
      }).map(function(key) {
        return caches.delete(key);
      }));
    }).catch(function(error) {
      console.error('Cleaning up older cache failed.');
      console.error(error);
    })
  );
});
