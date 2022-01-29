import * as App from "@firebase/app";
import * as Firestore from "@firebase/firestore";

const debugLocal = true;

const firebaseConfig = {
  apiKey: "AIzaSyCeQYlOSnX48Qagt_8Dotxezh2xYItJ4TU",
  authDomain: "gundamcard-1b980.firebaseapp.com",
  projectId: "gundamcard-1b980",
  storageBucket: "gundamcard-1b980.appspot.com",
  messagingSenderId: "1073379889421",
  appId: "1:1073379889421:web:c932c25e3b9497a3b66044",
};

export const rootApp = App.initializeApp(firebaseConfig, "rootApp");

const firestore = Firestore.initializeFirestore(rootApp, {});

const PATH = "app/GundamCard/context/default";

let _listener: (err: any, data: any) => void = () => {};
export function addListener(f: (err: any, data: any) => void) {
  if (debugLocal) {
    _listener = f;
    return;
  }
  return Firestore.onSnapshot(Firestore.doc(firestore, PATH), {
    next: (snapshot) => {
      const wrap = snapshot.data();
      if (wrap == null) {
        f(null, null);
        return;
      }
      const data = JSON.parse(wrap.data);
      f(null, data);
    },
    error: (e) => {
      f(e, null);
    },
  });
}

export function sync(data: any) {
  if (debugLocal) {
    // 必須異步發送
    setTimeout(() => {
      _listener(null, data);
    }, 0);
    return;
  }
  // 因為不支援巢狀陣列，所以要轉成字串
  // FirebaseError: Function setDoc() called with invalid data. Nested arrays are not supported (found in document app/GundamCard/context/default)
  const wrap = {
    data: JSON.stringify(data),
  };
  return Firestore.setDoc(Firestore.doc(firestore, PATH), wrap);
}
