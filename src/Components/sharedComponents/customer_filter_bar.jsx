import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const FilterBar = ({
  search,
  setSearch,
  sortOption,
  setSortOption,
  statusFilter,
  setStatusFilter,
  onAddCustomer, // optional prop to handle Add button
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>

          {/* Sort Filter */}
          <select
            className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="ordersAsc">Orders: Low → High</option>
            <option value="ordersDesc">Orders: High → Low</option>
            <option value="spentAsc">Spent: Low → High</option>
            <option value="spentDesc">Spent: High → Low</option>
          </select>
        </div>

        {/* Right Side: Add Button */}
        <button
          onClick={onAddCustomer}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 text-sm whitespace-nowrap w-full md:w-auto"
        >
          <FiPlus className="h-5 w-5" />
          Add New Customer
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
