// src/components/admins/admin_filter_bar.jsx
import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const AdminFilterBar = ({
  search,
  setSearch,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow max-w-md min-w-[250px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search admins..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-orange-950 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none focus:border-orange-950"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="az">Email A → Z</option>
            <option value="za">Email Z → A</option>
            <option value="newest">Date: Newest First</option>
            <option value="oldest">Date: Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterBar;
