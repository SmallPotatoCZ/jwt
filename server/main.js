const express = require('express');

const app = express();

// 挂载静态路径

app.use('/', express.static(__dirname + '/../html/index.html'));
app.use('/login', express.static(__dirname + '/../html/login.html'));
app.use('/register', express.static(__dirname + '/../html/register.html'));

app.listen(8000);