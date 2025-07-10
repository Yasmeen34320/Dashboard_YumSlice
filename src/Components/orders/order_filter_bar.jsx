// src/components/orders/OrderFilterBar.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const OrderFilterBar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full md:w-auto">
        <div className="relative flex-grow max-w-md min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-950 text-sm placeholder-gray-400 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-w-[180px] py-2 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-950 transition-all"
        >
          <option value="all">All Statuses</option>
          {['pending', 'preparing', 'shipped', 'delivered', 'Canceled', 'Returned']
            .map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  </div>
);

export default OrderFilterBar;
