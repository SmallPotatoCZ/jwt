const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  // 验证时间大约为 13 秒
  const hashCost = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDocment = new UserModel({
      username,
      passwordHash
    });
    await userDocment.save();

    res.status(200).send({
      username
    });
  } catch (error) {
    res.status(400).send({
      error: 'req body should take the form {username,password}'
    });
  }
});

router.post('/login', (req, res) => {
  passport.authenticate('local', {
      session: false
    },
    (error, user) => {
      if (error || !user) {
        res.status(400).json({
          error
        });
      }

      const payload = {
        username: user.username,
        expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS)
      }

      req.login(payload, {
        session: false
      }, (error) => {
        if (error) {
          res.status(400).send({
            error
          });
        }

        // 生成签名的 jwt
        const token = jwt.sign(JSON.stringify(payload), keys.secret);

        // 将 jwt 注入到 cookie 中
        res.cookie('jwt', jwt, {
          httpOnly: true,
          secure: true
        });
        res.status(200).send({
          username
        });
      })(req, res);
    })
});

module.exports = router;