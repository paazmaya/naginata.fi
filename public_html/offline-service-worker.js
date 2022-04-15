
const VERSION = '20190920a';

const cacheFilesFirst = [
  '/css/naginata.min.css',
  '/favicon.ico',
  '/img/logo.png',
  '/img/naginata-bogu-chudan-artwork-lecklin.png',
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
