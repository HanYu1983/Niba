const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5174;
const GRAPHQL_TARGET = process.env.GRAPHQL_PROXY_TARGET;

if (!GRAPHQL_TARGET) {
  throw new Error('GRAPHQL_PROXY_TARGET 未設定');
}

app.use(express.static(__dirname));

app.use('/graphql', createProxyMiddleware({
  target: GRAPHQL_TARGET,
  changeOrigin: true,
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AdminElm 靜態 + /graphql 代理 → ${GRAPHQL_TARGET}`);
  console.log(`http://localhost:${PORT}`);
});
