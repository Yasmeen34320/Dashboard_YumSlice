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
}) => (
  <div className="bg-white p-4 rounded shadow mb-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-3 py-2 border rounded w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 border rounded"
        >
          <option value="all">All Categories</option>
          <option value="Birthday">Birthday</option>
          <option value="Wedding">Wedding</option>
          <option value="Cheesecakes">Cheesecakes</option>
          <option value="Cupcakes">Cupcakes</option>
          <option value="Molten Cakes">Molten Cakes</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="py-2 px-3 border rounded"
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

      <button
        onClick={onAddProduct}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        <FiPlus className="h-5 w-5" /> Add Product
      </button>
    </div>
  </div>
);

export default ProductFilterBar;
