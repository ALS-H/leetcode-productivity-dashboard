const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../auth');

// ✅ Consistently use req.user.uid as userId everywhere

// GET all notes for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new note
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, link, tags, content } = req.body;

    if (!title || !link || !content) {
      return res.status(400).json({ error: 'Title, link, and content are required.' });
    }

    const note = new Note({
      title: title.trim(),
      link: link.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : [],
      content: content.trim(),
      user: userId  // ✅ Correct field populated
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('POST /api/notes error:', err);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// PUT update a note (only if owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.uid;
    const updateData = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },  // ✅ Only allow if the user owns the note
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a note (only if owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: userId  // ✅ Enforce ownership
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
