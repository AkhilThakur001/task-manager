import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isManualOrder, setIsManualOrder] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReorder = (reorderedTasks) => {
    setIsManualOrder(true);
    setTasks(reorderedTasks);
  };

  const handleToggle = async (id, completed) => {
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // If searching, prioritize title starts-with matches first
      if (search) {
        const aStarts = a.title.toLowerCase().startsWith(search.toLowerCase());
        const bStarts = b.title.toLowerCase().startsWith(search.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
      }

      // If user manually reordered, respect that order
      if (isManualOrder) return 0;

      // Default: sort by due date (earliest first, no due date at bottom)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Stay organised, stay productive</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm flex justify-between items-center">
            <span>⚠ {error}</span>
            <button
              onClick={() => setError('')}
              className="ml-4 font-bold hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add task form */}
        <TaskForm onAdd={handleAdd} />

        {/* Filter + search */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {/* Sort indicator */}
        <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
          <span>{isManualOrder ? '📌 Custom order' : '📅 Sorted by due date'}</span>
          {isManualOrder && (
            <button
              onClick={() => setIsManualOrder(false)}
              className="text-blue-400 hover:text-blue-600 transition"
            >
              Reset to due date order
            </button>
          )}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">⏳</p>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReorder={handleReorder}
          />
        )}

      </div>
    </div>
  );
}

export default App;