import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const CustomerFilterBar = ({
  search,
  setSearch,
  sortOption,
  setSortOption,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md min-w-[250px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-orange-950 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none focus:border-orange-950"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>

          {/* Sort Filter */}
          <select
            className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none  focus:border-orange-950"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="ordersAsc">Orders: Low → High</option>
            <option value="ordersDesc">Orders: High → Low</option>
            <option value="spentAsc">Spent: Low → High</option>
            <option value="spentDesc">Spent: High → Low</option>
            <option value="newest">Date: Newest First</option>
            <option value="oldest">Date: Oldest First</option> 
          </select>
        </div>

      </div>
    </div>
  );
};

export default CustomerFilterBar;