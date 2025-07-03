import React, { useCallback, useMemo, useState } from 'react';
import useProducts from '../../hooks/useProducts';
import FilterBar from './product_filter_bar';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import MessageBox from '../sharedComponents/MessageBox';
import EditProductModal from './EditProductModal';
import { updateProductById } from '../../services/productService';
import { formatDate } from '../../utils/format';

const ProductsManagement = () => {
  const {
    loading, filteredProducts, search, setSearch, categoryFilter, setCategoryFilter,
    sortOption, setSortOption, selectedProducts, selectAll,
    handleModalConfirm, openSingleDeleteModal, openBulkDeleteModal, isModalOpen,
    handleProductSelect, handleSelectAll, isBulkDelete, handleModalCancel,
    setProducts
  } = useProducts();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

const openEditModal = useCallback((product) => {
  setEditingProduct(product);
  setIsEditOpen(true);
}, []);

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateProductById(updatedData._id, updatedData);
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedData._id ? updatedData : p))
      );
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      closeEditModal();
    }
  };

  const columns = useMemo(() => [
    {
      label: '',
      key: '',
      render: (product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id)}
          onChange={() => handleProductSelect(product._id)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      ),
    },
    {
      label: 'Product',
      key: 'name',
      render: (product) => (
        <div className="flex items-center gap-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 rounded object-cover border"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-400">{formatDate(product.createdAt)}</div>
            
          </div>
        </div>
      )
    },
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price', render: p => `EGP ${p.price}` },
    { label: 'Stock', key: 'stock' },
    {
      label: 'Discount',
      key: 'discountPercentage',
      render: p => `${p.discountPercentage}%`
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(product)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
          </button>
          <button
            onClick={() => openSingleDeleteModal(product._id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            title="Delete"
          >
              <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          </button>
        </div>
      )
    }
  ], [selectedProducts, handleProductSelect, openEditModal, openSingleDeleteModal]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <FilterBar
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Bulk actions */}
      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-800">
            {selectedProducts.length > 0
              ? `${selectedProducts.length} selected`
              : 'Select All'}
          </span>
        </div>

        <button
          onClick={openBulkDeleteModal}
          disabled={selectedProducts.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
            selectedProducts.length > 0
              ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete Selected
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading products...</p>
          </div>
        </div>
      ) : (
        <PaginatedDataTable data={filteredProducts} columns={columns} rowsPerPage={10} />
      )}

      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={
          isBulkDelete
            ? `Are you sure you want to delete ${selectedProducts.length} selected products?`
            : 'Are you sure you want to delete this product?'
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditOpen}
        product={editingProduct}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ProductsManagement;
