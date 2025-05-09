const http = require('http');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyBySqWc7moBcMhvh8dSCcyBO7o02nWEmn0",
    authDomain: "fast-drake-630.firebaseapp.com",
    databaseURL: "https://fast-drake-630.firebaseio.com",
    projectId: "fast-drake-630",
    storageBucket: "fast-drake-630.firebasestorage.app",
    messagingSenderId: "241640252242",
    appId: "1:241640252242:web:9a4ba9a9bfb7528af2108b"
};

// Initialize Firebase
const app = admin.initializeApp(firebaseConfig);

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { idToken } = JSON.parse(body);
                app.auth().verifyIdToken(idToken)
                    .then((decodedToken) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, user: decodedToken }));
                    })
                    .catch((error) => {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: error.message }));
                    });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './login.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(3000, () => {
    console.log('Firebase initialized successfully!');
    console.log('Node.js server running on port 3000');
});

