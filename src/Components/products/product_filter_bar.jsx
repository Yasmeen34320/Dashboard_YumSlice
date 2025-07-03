import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const ProductFilterBar = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Birthday">Birthday</option>
            <option value="Wedding">Wedding</option>
            <option value="Cheesecakes">Cheesecakes</option>
            <option value="Cupcakes">Cupcakes</option>
            <option value="Molten Cakes">Molten Cakes</option>
          </select>

          {/* Sort By */}
          <select
            className="border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="az">Name: A → Z</option>
            <option value="za">Name: Z → A</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Rating: High → Low</option>
            <option value="newest">Date: Newest First</option> 
            <option value="oldest">Date: Oldest First</option>
          </select>
        </div>

        {/* Optional Add Product Button */}
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm whitespace-nowrap w-full md:w-auto">
          <FiPlus className="h-5 w-5" />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductFilterBar;
