import { initializeApp } from "./firebase-app.js"
import { getMessaging, getToken } from "./firebase-messaging.js"

const firebaseConfig = {
  apiKey: "AIzaSyAXZSbDV1wp6tTyyHYX61Q1yfDmI8e_r44",
  authDomain: "usehitokuse.firebaseapp.com",
  projectId: "usehitokuse",
  storageBucket: "usehitokuse.firebasestorage.app",
  messagingSenderId: "353580789457",
  appId: "1:353580789457:web:499c3ca51a93b6d2561ff0"
};
export async function startMessaing() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const messaging = getMessaging(initializeApp(firebaseConfig));
      const token = await getToken(messaging, { vapidKey: "BEO6F5uMvOmhQu9_O6yOzsNyr8R6s4mv9HFfakAM0S2tbwC5Ec1IHAiorAwgi-oHNuEnN1I448mgOFLVp1liDH0" });
      console.log("通知トークン:", token);
      // メッセージ受信イベント
      messaging.onMessage((payload) => {
        console.log("通知受信:", payload);
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon
        });
      });
    }
  } catch (error) {
    console.error("通知トークンの取得失敗:", error);
  }
}