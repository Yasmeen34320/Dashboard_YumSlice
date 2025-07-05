import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

const ProductFilterBar = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
  onAddProduct
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md min-w-[250px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-950 text-sm placeholder-gray-400 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-w-[180px] py-2 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none  focus:border-orange-950 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="Birthday">Birthday</option>
            <option value="Wedding">Wedding</option>
            <option value="Cheesecakes">Cheesecakes</option>
            <option value="Cupcakes">Cupcakes</option>
            <option value="Molten Cakes">Molten Cakes</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="min-w-[180px] py-2 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-950 transition-all"
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Rating: High → Low</option>
            <option value="newest">Date: Newest First</option>
            <option value="oldest">Date: Oldest First</option>
          </select>
        </div>

        {/* Right Side: Add Product Button */}
        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 bg-orange-950 hover:bg-orange-900 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 text-sm whitespace-nowrap w-full md:w-auto cursor-pointer"
        >
          <FiPlus className="h-5 w-5" />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductFilterBar;