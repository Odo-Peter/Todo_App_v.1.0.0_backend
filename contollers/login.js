const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../Models/Users');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCheck =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCheck)) {
    return res.status(401).json({
      error: 'Invalid password or username',
    });
  }

  const userDetails = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userDetails, process.env.CRYPTO_KEY, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({
    token,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
  });
});

module.exports = loginRouter;
