const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const morgan = require('morgan');

const todoRouter = require('./contollers/todo');
const userRouter = require('./contollers/users');
const loginRouter = require('./contollers/login');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(middleware.tokenExtractor);
app.use('/api/todos', todoRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorHandler);

app.get('/', (req, res) => {
  res.send('It is working');
});

module.exports = app;
