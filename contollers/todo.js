const todoRouter = require('express').Router();
const Todo = require('../Models/Todo');
const { userExtractor } = require('../utils/middleware');

todoRouter.get('/', async (req, res) => {
  const todos = await Todo.find({}).populate('user', {
    firstname: 1,
    lastname: 1,
    username: 1,
  });

  res.json(todos);
});

todoRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  res.json(todo);
});

todoRouter.post('/', userExtractor, async (req, res) => {
  const { todo, checked } = req.body;

  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized request',
    });
  } else if (!todo) {
    return res.status(403).json({
      error: 'Todo field required',
    });
  } else {
    const newTodo = new Todo({
      todo,
      checked: checked || false,
      user: user.id,
    });

    const savedTodo = await newTodo.save();
    user.todos = user.todos.concat(savedTodo._id);

    await user.save();
    res.status(201).json(savedTodo);
  }
});

todoRouter.put('/:id', userExtractor, async (req, res) => {
  const { todo, checked } = req.body;
  const { id } = req.params;

  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized request',
    });
  }

  const newTodo = {
    todo,
    checked,
  };

  const updatedTodo = await Todo.findByIdAndUpdate(id, newTodo, { new: true });

  res.json(updatedTodo);
});

todoRouter.delete('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const todo = await Todo.findById(id);

  if (!(todo.user.toString() === user.id.toString())) {
    return res.status(405).json({ error: 'Permission Denied' });
  }

  await Todo.findByIdAndDelete(id);
  res.status(201).end();
});

module.exports = todoRouter;
