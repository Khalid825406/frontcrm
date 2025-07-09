// importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// // ✅ Firebase Init
// firebase.initializeApp({
//   apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
//   authDomain: "my-crm-notifications.firebaseapp.com",
//   projectId: "my-crm-notifications",
//   storageBucket: "my-crm-notifications.firebasestorage.app",
//   messagingSenderId: "899592786368",
//   appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
//   measurementId: "G-EMEYQ2GK0E"
// });

// const messaging = firebase.messaging();

// // ✅ Handle background FCM messages manually
// messaging.onBackgroundMessage((payload) => {
//   console.log("📩 Background message received:", payload);

//   const title = payload.data?.title || "New Notification";
//   const body = payload.data?.body || "";
//   const click_action = payload.data?.click_action || 'https://www.sultanmedical-crm.com/';

//   self.registration.showNotification(title, {
//     body,
//     icon: '/icon-512.png',
//     data: { click_action },
//   });
// });

// // ✅ On notification click
// self.addEventListener('notificationclick', function (event) {
//   const click_action = event.notification.data?.click_action || 'https://www.sultanmedical-crm.com/';
//   event.notification.close();

//   event.waitUntil(
//     clients.matchAll({ type: 'window' }).then((clientList) => {
//       for (const client of clientList) {
//         if (client.url === click_action && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow(click_action);
//       }
//     })
//   );
// });
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// ✅ Firebase Init
firebase.initializeApp({
  apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
  authDomain: "my-crm-notifications.firebaseapp.com",
  projectId: "my-crm-notifications",
  storageBucket: "my-crm-notifications.appspot.com",
  messagingSenderId: "899592786368",
  appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
  measurementId: "G-EMEYQ2GK0E"
});

const messaging = firebase.messaging();

// ✅ Background FCM
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const title = payload.data?.title || "New Notification";
  const body = payload.data?.body || "";
  const click_action = payload.data?.click_action || 'https://www.sultanmedical-crm.com/';

  self.registration.showNotification(title, {
    body,
    icon: '/icon-512.png',
    data: { click_action },
  });
});

// ✅ Notification click handler
self.addEventListener('notificationclick', function (event) {
  const click_action = event.notification.data?.click_action || 'https://www.sultanmedical-crm.com/';
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === click_action && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(click_action);
      }
    })
  );
});
