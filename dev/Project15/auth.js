import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyBySqWc7moBcMhvh8dSCcyBO7o02nWEmn0",
    authDomain: "fast-drake-630.firebaseapp.com",
    projectId: "fast-drake-630",
    storageBucket: "fast-drake-630.firebasestorage.app",
    messagingSenderId: "241640252242",
    appId: "1:241640252242:web:9a4ba9a9bfb7528af2108b"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 登入按鈕事件處理
document.getElementById('loginBtn').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            // 登入成功
            console.log('登入成功:', result.user);
            alert(`歡迎, ${result.user.displayName}`);
            
            // 呼叫後端登入API
            return result.user.getIdToken().then((idToken) => {
                return fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken })
                });
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('後端驗證失敗');
                }
                return response.json();
            }).then((data) => {
                console.log('後端驗證成功:', data);
            });
        }).catch((error) => {
            // 處理錯誤
            console.error('登入錯誤:', error);
            alert(`登入失敗: ${error.message}`);
        });
});

document.getElementById('facebookLoginBtn').addEventListener('click', () => {
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            console.log('Facebook登入成功:', result.user);
            alert(`歡迎, ${result.user.displayName}`);
        }).catch((error) => {
            // 在錯誤處理中加入特定判斷
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert('此電子郵件已用其他方式註冊，請改用原登入方式');
                return;
            }
            console.error('Facebook登入錯誤:', error);
            alert(`Facebook登入失敗: ${error.message}`);
        });
});