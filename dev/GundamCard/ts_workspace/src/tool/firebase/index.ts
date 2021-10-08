import * as App from "@firebase/app";
import * as Firestore from "@firebase/firestore";

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

const PATH = "context/default";
export function addListener(f: (err: any, data: any) => void) {
  return Firestore.onSnapshot(Firestore.doc(firestore, PATH), {
    next: (snapshot) => {
      f(null, snapshot.data());
    },
    error: (e) => {
      f(e, null);
    },
  });
}

export function sendData(data: any) {
  return Firestore.setDoc(Firestore.doc(firestore, PATH), data);
}
