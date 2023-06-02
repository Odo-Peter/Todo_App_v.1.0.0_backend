const logger = require('../utils/logger');
const config = require('../utils/config');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;

logger.info('connecting to ..... MONGODB');

//connecting to the DB
mongoose
  .connect(url)
  .then(() => logger.info('Connected to MONGODB'))
  .catch((err) => logger.error('Error connecting to MONGODB', err));

//the todoSchema
const todoSchema = new mongoose.Schema(
  {
    todo: { type: String, required: true },
    checked: Boolean,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

todoSchema.set('toJSON', {
  transform: (document, returnedTodo) => {
    returnedTodo.id = returnedTodo._id.toString();
    delete returnedTodo._id;
    delete returnedTodo.__v;
  },
});

module.exports = mongoose.model('Todo', todoSchema);
