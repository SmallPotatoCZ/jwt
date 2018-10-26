const router = require('express').Router;

router.get('/protected',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const {
      user
    } = req;

    res.status(200).send({
      user
    });
  });

module.exports = router;