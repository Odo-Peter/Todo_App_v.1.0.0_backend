const userRouter = require('express').Router();
const User = require('../Models/Users');
const bcrypt = require('bcryptjs');

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('todos', {
    todo: 1,
    checked: 1,
  });

  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  if (!firstname || !lastname || !username || !password) {
    res.status(400).json({
      error: 'All fields are required',
    });
  } else if (password.length < 3) {
    res.status(403).json({
      error: 'password should be above 3 characters',
    });
  } else {
    const salt = 10;

    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstname,
      lastname,
      username,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
});

module.exports = userRouter;
