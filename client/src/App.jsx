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

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to edit task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  // Filter + search logic
  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

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
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold">✕</button>
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
          />
        )}

      </div>
    </div>
  );
}

export default App;