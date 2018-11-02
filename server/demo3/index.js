const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

const PORT = 8888;
const users = [{
  id: 1,
  username: 'zhangchao1',
  password: '123'
}, {
  id: 2,
  username: 'zhangchao2',
  password: '456'
}];

app.get('/time', (req, res) => {
  const time = (new Date()).toLocaleDateString();
  res.status(200).send(`The time is ${time}`);
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Error. Please enter the correct username or password");
    return;
  }
  const user = users.find((u) => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    res.status(401).send("Error. Please enter the correct username or password");
    return;
  }

  const token = jwt.sign({
    sub: user.id,
    username: user.username
  }, "zhangchao", {
    expiresIn: "3 hours"
  });

  res.status(200).send({
    access_token: token
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});