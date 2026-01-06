importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '353580789457'
});
const messaging = firebase.messaging();
// Background Message Handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  var notification = payload.notification;
  var notificationTitle = notification.title;
  var notificationOptions = {
    body: notification.body,
    icon: '/static/images/logo.png'
  };

  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(notify);
      }
    })
    .then(() => {
      return self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  return promiseChain;
});
