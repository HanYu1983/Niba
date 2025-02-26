app.messaging = async function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAXZSbDV1wp6tTyyHYX61Q1yfDmI8e_r44",
    authDomain: "usehitokuse.firebaseapp.com",
    projectId: "usehitokuse",
    storageBucket: "usehitokuse.firebasestorage.app",
    messagingSenderId: "353580789457",
    appId: "1:353580789457:web:499c3ca51a93b6d2561ff0"
  };
  async function startMessaing() {
    const { app: { initializeApp }, messaging: { getMessaging, getToken, onMessage } } = window.Firebase
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const messaging = getMessaging(initializeApp(firebaseConfig));
        const justPathButNoFile = 'firebase-messaging-sw.js'
        const registration = await navigator.serviceWorker.register(justPathButNoFile)
        await navigator.serviceWorker.ready
        const token = await getToken(messaging, {
          vapidKey: "BEO6F5uMvOmhQu9_O6yOzsNyr8R6s4mv9HFfakAM0S2tbwC5Ec1IHAiorAwgi-oHNuEnN1I448mgOFLVp1liDH0",
          serviceWorkerRegistration: registration
        });
        console.log("通知トークン:", token);
        onMessage(messaging, (payload) => {
          console.log("通知受信:", payload);
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon
          });
        });
        //const notification = new Notification("Hi there!");
      }
    } catch (error) {
      console.error("通知トークンの取得失敗:", error);
    }
  }
  return {
    startMessaing
  }
}()
