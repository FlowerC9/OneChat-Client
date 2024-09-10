importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBSNryKlYDF8wI6ennPRrlpTwrlTu9ukzA",
  authDomain: "onechat-a2303.firebaseapp.com",
  projectId: "onechat-a2303",
  storageBucket: "onechat-a2303.appspot.com",
  messagingSenderId: "243896323420",
  appId: "1:243896323420:web:e7794d8e4e2dd44f774599",
  measurementId: "G-PH5SHTT5E1",
};
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click Received.', event.notification.data);
  event.notification.close();

  // Handle click action based on the data payload
  const clickAction = event.notification.data.click_action;
  if (clickAction === 'OPEN_URL') {
    event.waitUntil(clients.openWindow('/'));
  } else {
    // Default action, focus on existing window if open or open new window
    event.waitUntil(clients.openWindow('/'));
  }
});
