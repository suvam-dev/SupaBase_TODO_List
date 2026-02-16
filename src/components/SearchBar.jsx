import { Search } from 'lucide-react';

export default function SearchBar({ filter, setFilter }) {
  return (
    <div className="search-filter-bar">
      <div className="search-input-wrapper">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={filter.search}
          onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>
      <select
        className="filter-select"
        value={filter.priority}
        onChange={e => setFilter(prev => ({ ...prev, priority: e.target.value }))}
      >
        <option value="">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>
    </div>
  );
}
