import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const PromoFilterBar = ({
  search, setSearch,
  sortOption, setSortOption,
  onAdd
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search promo codes..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-950 text-sm placeholder-gray-400"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-sm text-sm text-gray-700 focus:outline-none focus:border-orange-950"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="codeAz">Code: A → Z</option>
          <option value="codeZa">Code: Z → A</option>
        </select>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-orange-950 hover:bg-orange-900 text-white px-5 py-2.5 rounded-lg shadow-sm text-sm cursor-pointer"
      >
        <FiPlus className="h-5 w-5" /> Add Promo
      </button>
    </div>
  </div>
);

export default PromoFilterBar;
