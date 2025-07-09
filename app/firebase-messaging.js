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

// // ✅ Get FCM token and send to backend
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

// // ✅ Foreground listener
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     if (!messaging) return;
//     onMessage(messaging, (payload) => {
//       console.log("📲 Foreground Message:", payload);
//       resolve(payload);
//     });
//   });

// app/firebase-messaging.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let messaging;

if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestForToken = async () => {
  if (!messaging) return;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      await fetch("https://new-crm-sdcn.onrender.com/api/notifications/save-fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fcmToken: currentToken }),
      });
    } else {
      console.warn("⚠️ No token available. Permission denied?");
    }
  } catch (error) {
    console.error("🔥 FCM token error:", error);
  }
};

// ✅ Foreground notification listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("📲 Foreground Message:", payload);
      resolve(payload);
    });
  });
