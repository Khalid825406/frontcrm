// // Import Firebase scripts (compat versions are required in Service Workers)
// importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// // ✅ Initialize Firebase (same config as frontend)
// firebase.initializeApp({
//   apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
//   authDomain: "my-crm-notifications.firebaseapp.com",
//   projectId: "my-crm-notifications",
//   storageBucket: "my-crm-notifications.firebasestorage.app",
//   messagingSenderId: "899592786368",
//   appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
//   measurementId: "G-EMEYQ2GK0E"
// });

// // ✅ Get Firebase Messaging instance
// const messaging = firebase.messaging();

// // ✅ Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("📩 Background message received:", payload);

//   const { title, body } = payload.notification;

//   self.registration.showNotification(title, {
//     body: body,
//     icon: '/icon-512.png' 
//   });
// });

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// ✅ Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
  authDomain: "my-crm-notifications.firebaseapp.com",
  projectId: "my-crm-notifications",
  storageBucket: "my-crm-notifications.firebasestorage.app",
  messagingSenderId: "899592786368",
  appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
  measurementId: "G-EMEYQ2GK0E"
});

// ✅ Firebase Messaging
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const { title, body } = payload.notification;
  const click_action = payload.notification?.click_action || '/';

  self.registration.showNotification(title, {
    body,
    icon: '/icon-512.png',
    data: { click_action }, // ⬅️ Pass link for opening on click
  });
});

// ✅ Handle notification click to open PWA/APK
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
