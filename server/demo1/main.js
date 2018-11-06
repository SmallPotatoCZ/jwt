const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.port ? process.env.port : 3001;
const environment = process.env.NODE_ENV;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
if (environment !== 'production') {
  app.use(logger('dev'));
  app.use('/', logger('dev'));
}

const admin = {
  username: 'zhangchao',
  password: '123'
};

// 挂载各个系统接口
app.use('/', express.static(`${__dirname}/../../html/demo1`));
app.use('/assets', express.static(`${__dirname}/../../html/assets`));

// 登录接口
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username !== admin.username || password !== admin.password) {
    res.status(401).send({
      result: 'login failed, username or password was not found.'
    });
    return;
  }

  // 生成 token
  let token = jwt.sign({
    user: admin.username,
    role: 'admin'
  }, 'zhangchao', {
    expiresIn: 10
  });

  res.cookie('token', token, {
    expires: new Date(Date.now() + 60000),
    httpOnly: true
  });

  res.status(200).send({
    result: 'OK'
  });
});

// 登录成功后的测试接口
app.post('/test', (req, res) => {
  if (!req.cookies || !req.cookies.token) {
    res.status(200).send({
      result: false,
      msg: 'illegal request'
    });
    return;
  }
  let payload;
  jwt.verify(req.cookies.token, 'zhangchao', function (err, decoded) {
    if (err) {
      res.status(200).send({
        result: false,
        msg: 'illegal request'
      });
    } else {
      payload = decoded;
      console.log('user\' role is ', payload.role);

      res.status(200).send({
        result: true,
        msg: 'you can get result that you want.'
      });
    }
  });

});

app.get('/test', (req, res) => {
  if (!req.cookies || !req.cookies.token) {
    res.status(401).send({
      result: false,
      msg: 'illegal request'
    });
    return;
  }
  let payload;
  jwt.verify(req.cookies.token, 'zhangchao', function (err, decoded) {
    if (err) {
      res.status(401).send({
        result: false,
        msg: 'illegal request'
      });
    } else {
      payload = decoded;
      res.status(200).send({
        result: true,
        data: payload
      });
    }
  });
})

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log('server is listening at ', PORT);
})