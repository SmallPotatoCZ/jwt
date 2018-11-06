const qs = require('querystring');
const fs = require('fs');
const path = require('path');

const level = require('level');
const db = level(__dirname + '/db-');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "CHANGE_THIS_TO_SOMETHING_RANDOM"; // 随机数

// HTMl 挂载路径
function loadView(view) {
  var filepath = path.resolve(__dirname, './views', view + '.html');
  return fs.readFileSync(filepath).toString();
}

// HTMl 资源内容
var index = loadView('index'); // 主页
var restricted = loadView('restricted'); // JWT 正确的页面
var fail = loadView('fail'); // 用户登录失败

// 显示登录失败页面
function authFail(res, callback) {
  res.writeHead(401, {
    'content-type': 'text/html'
  });
  return res.end(fail);
}

// 生成全局唯一标识符
function generateGUID() {
  return new Date().getTime();
}

// 创建 JWT
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
  var GUID = generateGUID(); // write/use a better GUID generator in practice
  var token = generateToken(req, GUID, opts);
  var record = {
    "valid": true,
    "created": new Date().getTime()
  };

  db.put(GUID, JSON.stringify(record), function (err) {
    // console.log("record saved ", record);
  });

  return token;
}

function authSuccess(req, res) {
  var token = generateAndStoreToken(req);

  res.writeHead(200, {
    'content-type': 'text/html',
    'authorization': token
  });
  return res.end(restricted);
}

// 数据库中存储的用户
var u = {
  un: 'zc',
  pw: '123'
};

// 处理用户登录请求
function authHandler(req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    }).on('end', function () {
      var post = qs.parse(body);
      if (post.username && post.username === u.un && post.password && post.password === u.pw) {
        return authSuccess(req, res);
      } else {
        return authFail(res);
      }
    });
  } else {
    return authFail(res);
  }
}

// 判定 token 的正确与否
function verify(token) {
  var decoded = false;
  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    decoded = false; // still false
  }
  return decoded;
}

// 返回个人 token
function privado(res, token) {
  res.writeHead(200, {
    'content-type': 'text/html',
    'authorization': token
  });
  return res.end(restricted);
}

function validate(req, res, callback) {
  var token = req.headers.authorization;
  var decoded = verify(token);
  if (!decoded || !decoded.auth) {
    authFail(res);
    return callback(res);

  } else {
    // check if a key exists, else import word list:
    db.get(decoded.auth, function (err, record) {
      var r;
      try {
        r = JSON.parse(record);
      } catch (e) {
        r = {
          valid: false
        };
      }
      if (err || !r.valid) {
        authFail(res);
        return callback(res);
      } else {
        privado(res, token);
        return callback(res);
      }
    });
  }
}

function exit(res) {
  res.writeHead(404, {
    'content-type': 'text/plain'
  });
  res.end('bye');
  process.exit(); // kill the server!
}

function notFound(res) {
  res.writeHead(404, {
    'content-type': 'text/plain'
  });
  return res.end('Not Found');
}

function home(res) {
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  return res.end(index);
}

function done(res) {
  return; // does nothing. (pass as callback)
}

function logout(req, res, callback) {
  // invalidate the token
  var token = req.headers.authorization;
  // console.log(' >>> ', token)
  var decoded = verify(token);
  if (decoded) { // otherwise someone can force the server to crash by sending a bad token!
    // asynchronously read and invalidate
    db.get(decoded.auth, function (err, record) {
      var updated = JSON.parse(record);
      updated.valid = false;
      db.put(decoded.auth, updated, function (err) {
        // console.log('updated: ', updated)
        res.writeHead(200, {
          'content-type': 'text/plain'
        });
        res.end('Logged Out!');
        return callback(res);
      });
    });
  } else {
    authFail(res, done);
    return callback(res);
  }
}


module.exports = {
  fail: authFail,
  exit: exit,
  done: done, // moch callback
  home: home,
  handler: authHandler,
  logout: logout,
  notFound: notFound,
  success: authSuccess,
  validate: validate,
  verify: verify,
  view: loadView,
  generateAndStoreToken: generateAndStoreToken
}