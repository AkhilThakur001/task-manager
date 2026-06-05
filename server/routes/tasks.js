const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/tasks.json');

function readTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    // If file is missing or corrupted, return empty array
    return [];
  }
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    throw new Error('Failed to save tasks to disk');
  }
}

// GET /api/tasks
router.get('/', (req, res) => {
  try {
    const tasks = readTasks();
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// POST /api/tasks
router.post('/', (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validate title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    // Validate title length
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters' });
    }

    // Validate description length
    if (description && description.length > 1000) {
      return res.status(400).json({ error: 'Description must be under 1000 characters' });
    }

    // Validate due date format
    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create task' });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validate id format
    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const tasks = readTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, dueDate, completed } = req.body;

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({ error: 'Title must be under 200 characters' });
      }
    }

    // Validate completed if provided
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }

    // Validate due date if provided
    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }

    // Only update allowed fields
    const allowedUpdates = { title, description, dueDate, completed };
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    tasks[index] = { ...tasks[index], ...allowedUpdates };
    writeTasks(tasks);

    res.json(tasks[index]);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const tasks = readTasks();
    const filtered = tasks.filter((t) => t.id !== id);

    if (filtered.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(filtered);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete task' });
  }
});

module.exports = router;