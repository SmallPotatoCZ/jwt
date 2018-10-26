const port = process.env.PORT || 1337; // 定义端口
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const common = require('./jwt.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// 应用路径
app.use('/assets', express.static(path.resolve(__dirname, '../../html/assets')));
app.use('/', express.static(path.resolve(__dirname, '../../html/jwt')));
app.get('/', (req, res) => {
  res.type('html').sendfile(common.static('index'));
}); // 主页
app.get('/home', (req, res) => {
  res.type('html').sendfile(common.static('index'));
}); // 主页

// API 接口
app.post('/login', (req, res) => {
  console.log('request body is ', req.body);
  common.authHandler(req, res);
});
// 验证登录状态
app.post('/private', (req, res) => {
  console.log('request header is ', req.headers);
  res.status(200).send({
    'result': 'ok'
  });
});

app.listen(port);
console.log('Visit: http://127.0.0.1:' + port);