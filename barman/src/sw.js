if ('function' === typeof importScripts) {
    importScripts(
      'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
    );
    /* global workbox */
    if (workbox) {
      console.log('Workbox is loaded');
  
      /* injection point for manifest files.  */
      workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  
  /* custom cache rules*/
  workbox.routing.registerNavigationRoute('/index.html', {
        blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
      });
  
  workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg)$/,
        workbox.strategies.cacheFirst({
          cacheName: 'images',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
          ],
        })
      );
  
  } else {
      console.log('Workbox could not be loaded. No Offline support');
    }
  }

  self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request))
  })

// self.addEventListener('notificationclick', function (e) {
//     var notification = e.notification;
//     notification.close();
//     const rootUrl = new URL('/', location).href;
//     e.notification.close();
//     // Enumerate windows, and call window.focus(), or open a new one.
//     e.waitUntil(
//         clients.matchAll().then(matchedClients => {
//             for (let client of matchedClients) {
//                 if (client.url === rootUrl) {
//                     return client.focus();
//                 }
//             }
//             return clients.openWindow("/");
//         })
//     );

// });
// self.addEventListener('push', function (event) {

//     const data = JSON.parse(event.data.text())
//     const title = data.sender || data.title
//     const options = {
//         body: data.text,
//         icon: "https://res.cloudinary.com/hphlbmikx/image/upload/v1544196666/android-chrome-512x512.png",
//         badge: "https://res.cloudinary.com/hphlbmikx/image/upload/v1544196664/android-chrome-96x96.png",
//         vibrate: [100, 50]
//     };

//     event.waitUntil(self.registration.showNotification(title, options));
// });


