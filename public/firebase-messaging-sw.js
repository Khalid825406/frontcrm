// Import Firebase scripts (compat versions are required in Service Workers)
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// ✅ Initialize Firebase (same config as frontend)
firebase.initializeApp({
  apiKey: "AIzaSyBS8_6vhr4DRdrSXXWoMTTzgx_Nu8nPRpQ",
  authDomain: "my-crm-notifications.firebaseapp.com",
  projectId: "my-crm-notifications",
  storageBucket: "my-crm-notifications.firebasestorage.app",
  messagingSenderId: "899592786368",
  appId: "1:899592786368:web:05c494f7a5fad7a0bef825",
  measurementId: "G-EMEYQ2GK0E"
});

// ✅ Get Firebase Messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body: body,
    icon: '/firebase-logo.png' 
  });
});