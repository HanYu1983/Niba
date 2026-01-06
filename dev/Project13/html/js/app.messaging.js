app.messaging = async function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAXZSbDV1wp6tTyyHYX61Q1yfDmI8e_r44",
    authDomain: "usehitokuse.firebaseapp.com",
    projectId: "usehitokuse",
    storageBucket: "usehitokuse.firebasestorage.app",
    messagingSenderId: "353580789457",
    appId: "1:353580789457:web:499c3ca51a93b6d2561ff0"
  };

  async function saveToServer(token) {
    const url = "https://3btqhrhildghr3wdhsxrbhiivq0psmry.lambda-url.ap-northeast-1.on.aws"
    const response = await fetch(url, {
      method: "POST",
      body: token
    })
    if (!response.ok) {
      console.log(response)
      throw new Error(`Response status: ${response.status}`);
    }
    console.log(await response.json())
  }
  async function startMessaing() {
    const { app: { initializeApp }, messaging: { getMessaging, getToken, onMessage, isSupported } } = window.Firebase
    try {
      if(isSupported() == false){
        throw new Error("not support")
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const messaging = getMessaging(initializeApp(firebaseConfig));
        const justPathButNoFile = 'firebase-messaging-sw.js'
        await navigator.serviceWorker.register(justPathButNoFile)
        const registration = await navigator.serviceWorker.ready
        registration.showNotification("title", { body: "body" })

        const token = await getToken(messaging, {
          vapidKey: "BEO6F5uMvOmhQu9_O6yOzsNyr8R6s4mv9HFfakAM0S2tbwC5Ec1IHAiorAwgi-oHNuEnN1I448mgOFLVp1liDH0",
          serviceWorkerRegistration: registration
        });
        console.log(token)
        alert("通知トークン:" + token);
        await saveToServer(token)
        onMessage(messaging, (payload) => {
          alert("通知受信:" + payload);
          // 使用registration.showNotification才能同時支援safari和chrome
          registration.showNotification(payload.notification.title, { 
            body: payload.notification.body,
            icon: payload.notification.icon
          })
        });
      }
    } catch (error) {
      console.error("通知トークンの取得失敗:", error);
      alert(`通知トークンの取得失敗: ${error}`)
    }
  }
  return {
    startMessaing
  }
}()
