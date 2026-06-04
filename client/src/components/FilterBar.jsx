function FilterBar({ filter, setFilter, search, setSearch, activeCount, completedCount }) {
  return (
    <div className="mb-6">
      {/* Task counts */}
      <div className="flex gap-4 mb-3 text-sm text-gray-500">
        <span>{activeCount} active</span>
        <span>{completedCount} completed</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Filter buttons */}
      <div className="flex gap-2">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition
              ${filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;