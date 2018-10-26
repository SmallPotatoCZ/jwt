const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: username,
  passwordField: password
}, async (username, password, done) => {
  try {
    const userDocument = await UserModel.findOne({
      username: username
    }).exec();
    const passwordMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordMatch) {
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done('error');
  }
}));

passport.use(new JWTStrategy({
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: secret,
}, (jwtPayload, done) => {
  if (jwtPayload.expires > Date.now()) {
    return done('jwt expired');
  }

  return done(null, jwtPayload);
}));