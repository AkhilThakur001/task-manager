import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    await onEdit(task.id, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow p-4 mb-3 border-l-4 transition
      ${task.completed ? 'border-green-400' : isOverdue ? 'border-red-400' : 'border-blue-400'}`}
    >
      {isEditing ? (
        // Edit mode
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
          />

          {/* Task details */}
          <div className="flex-1">
            <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </p>

            {task.description && (
              <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
            )}

            {task.dueDate && (
              <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                {isOverdue ? '⚠ Overdue · ' : '📅 '}
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-500 hover:text-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:text-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;