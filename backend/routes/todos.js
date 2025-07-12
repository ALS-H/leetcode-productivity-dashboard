const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../auth');

// 📦 GET all todos for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("❌ Failed to fetch todos:", err);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// ➕ POST create new todo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { task, completed = false } = req.body;

    if (!task || typeof task !== 'string' || !task.trim()) {
      return res.status(400).json({ message: 'Task is required and must be a non-empty string' });
    }

    const todo = new Todo({
      user: userId,
      task: task.trim(),
      completed,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("❌ Failed to create todo:", err);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// ✏️ PUT update todo (only if owned by user)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const todoId = req.params.id;
    const updateData = req.body;

    const updated = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update todo:", err);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// 🗑️ DELETE a todo (only if owned by user)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete todo:", err);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

module.exports = router;
