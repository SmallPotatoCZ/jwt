const path = require('path');
const level = require('level');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "CHANGE_THIS_TO_SOMETHING_RANDOM"; // 随机数

const db = level(__dirname + '/db');

function static(view) {
  return path.resolve(__dirname, '../../html/jwt/', view + '.html');
}

// 创建默认用户
const user = {
  username: 'zhangchao',
  password: '123456'
};

// 生成全局唯一标识符
function generateGUID() {
  return new Date().getTime();
}

// 创建 token
function generateToken(req, GUID, opts) {
  opts = opts || {};

  // 默认 token 七天后过期
  var expiresDefault = '7d';

  var token = jwt.sign({
    auth: GUID,
    agent: req.headers['user-agent']
  }, secret, {
    expiresIn: opts.expires || expiresDefault
  });

  return token;
}

// 存储生成的 token
function generateAndStoreToken(req, opts) {
  var GUID = generateGUID();
  var token = generateToken(req, GUID, opts);
  var record = {
    "valid": true,
    "created": new Date().getTime()
  };

  db.put(GUID, JSON.stringify(record), function (err) {
    console.log("record saved ", record);
  });

  return token;
}

// 登录成功
function authSuccess(req, res) {
  var token = generateAndStoreToken(req);

  res.set({
    'authorization': token
  });
  res.status(200).send({
    'result': true,
    'redirect': '/restricted.html'
  })
}

// 处理用户登录请求
function authHandler(req, res) {
  const body = req.body;
  if (body.username && body.username === user.username && body.password && body.password === user.password) {
    authSuccess(req, res);
  } else {
    res.status(200).send({
      'result': false,
      'redirect': '/fail.html'
    })
  }
}

module.exports = {
  authHandler: authHandler,
  static: static
}