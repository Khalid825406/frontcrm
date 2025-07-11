// // app/firebase-messaging.js
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// let messaging;

// if (typeof window !== "undefined" && typeof navigator !== "undefined") {
//   const app = initializeApp(firebaseConfig);
//   messaging = getMessaging(app);
// }

// export const requestForToken = async () => {
//   if (!messaging) return;

//   try {
//     const currentToken = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });

//     if (currentToken) {
//       console.log("✅ FCM Token:", currentToken);
//       await fetch("https://new-crm-sdcn.onrender.com/api/notifications/save-fcm-token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ fcmToken: currentToken }),
//       });
//     } else {
//       console.warn("⚠️ No token available. Permission denied?");
//     }
//   } catch (error) {
//     console.error("🔥 FCM token error:", error);
//   }
// };

// // ✅ Foreground notification listener
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     if (!messaging) return;
//     onMessage(messaging, (payload) => {
//       console.log("📲 Foreground Message:", payload);
//       resolve(payload);
//     });
//   });


importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
  authDomain: "my-crm-notifications.firebaseapp.com",
  projectId: "my-crm-notifications",
  storageBucket: "my-crm-notifications.firebasestorage.app",
  messagingSenderId: "899592786368",
  appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
  measurementId: "G-EMEYQ2GK0E"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const title = payload.data?.title || "New Notification";
  const body = payload.data?.body || "";
  const click_action = payload.data?.click_action || '/';

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    data: { click_action },
  });
});

self.addEventListener('notificationclick', function (event) {
  const click_action = event.notification.data?.click_action || '/';
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(click_action) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(click_action);
      }
    })
  );
});
