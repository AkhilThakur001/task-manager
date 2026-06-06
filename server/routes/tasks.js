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

router.get('/', (req, res) => {
  try {
    const tasks = readTasks();
    const hasOrder = tasks.some((t) => t.order !== undefined && t.order !== -1);

    if (hasOrder) {
      tasks.sort((a, b) => {
        if (a.order === -1 || a.order === undefined) return 1;
        if (b.order === -1 || b.order === undefined) return -1;
        return a.order - b.order;
      });
    } else {
      tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// POST /api/tasks
router.post('/', (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters' });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ error: 'Description must be under 1000 characters' });
    }

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

// POST /api/tasks/reorder — MUST be before /:id routes
router.post('/reorder', (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }

    const tasks = readTasks();

    // If empty array, clear all orders (reset to due date)
    if (orderedIds.length === 0) {
      const reset = tasks.map((task) => {
        const { order, ...rest } = task;
        return rest;
      });
      writeTasks(reset);
      return res.json({ message: 'Order reset successfully' });
    }

    // Assign order index to each task
    const reordered = tasks.map((task) => ({
      ...task,
      order: orderedIds.indexOf(task.id),
    }));

    writeTasks(reordered);
    res.json({ message: 'Order saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to save order' });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const tasks = readTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, dueDate, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({ error: 'Title must be under 200 characters' });
      }
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }

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