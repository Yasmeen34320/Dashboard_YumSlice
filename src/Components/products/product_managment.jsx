import React, { useMemo, useState, useCallback } from 'react';
import useProducts from '../../hooks/useProducts';
import ProductFilterBar from './product_filter_bar';
import EditOrAddProductModal from './edit_or_add_product_modal';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import MessageBox from '../sharedComponents/MessageBox';
import { createProduct, updateProductById } from '../../services/productService';
import { formatDate } from '../../utils/format';
import { FiTrash, FiEdit } from 'react-icons/fi';


const ProductsManagement = () => {
  const {
    loading,
    products,
    filteredProducts,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    selectedProducts,
    selectAll,
    handleProductSelect,
    handleSelectAll,
    handleModalConfirm,
    openSingleDeleteModal,
    openBulkDeleteModal,
    isModalOpen,
    handleModalCancel,
    setProducts
  } = useProducts();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openEditorAddModal = useCallback((product = null) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  }, []);

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (data) => {
    if (data._id) {
      await updateProductById(data._id, data);
      setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } else {
      const newProd = await createProduct(data);
      setProducts((prev) => [newProd.data, ...prev]);
    }
    closeEditModal();
  };

  const columns = useMemo(() => [
    {
      label: '',
      key: 'select',
      render: (p) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(p._id)}
          onChange={() => handleProductSelect(p._id)}
          className="h-4 w-4 accent-orange-950 border-gray-300 rounded cursor-pointer"
        />
      )
    },
    {
      label: 'Product',
      key: 'name',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover border" />
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-gray-500">{formatDate(p.createdAt)}</div>
          </div>
        </div>
      )
    },
    { label: 'Category', key: 'category' },
    { label: 'Price (EGP)', key: 'price', render: (p) => ` ${p.price.toFixed(2)}` },
    { label: 'Stock', key: 'stock' },
    { label: 'Discount', key: 'discountPercentage', render: (p) => `${p.discountPercentage}%` },
    {
      label: 'Actions',
      key: 'actions',
      render: (p) => (
        <div className="flex gap-2">
      <button
            onClick={() => openEditorAddModal(p)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 cursor-pointer"
            title="Edit"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => openSingleDeleteModal(p._id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 cursor-pointer"
            title="Delete"
          >
           <FiTrash />
          </button>
        </div>
      )
    }
  ], [selectedProducts, handleProductSelect, openEditorAddModal, openSingleDeleteModal]);

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      Products
      <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
        {products.length} items
      </span>
    </h1>

      <ProductFilterBar
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onAddProduct={() => openEditorAddModal()}
      />

      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 accent-orange-950 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">{selectedProducts.length > 0 ? `${selectedProducts.length} selected` : 'Select All'}</span>
        </div>
        <button
          onClick={openBulkDeleteModal}
          disabled={selectedProducts.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
          selectedProducts.length > 0
              ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}>
           <FiTrash className="h-5 w-5 mr-2" />
                   Delete Selected
        </button>
      </div>

       {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <svg
            className="animate-spin h-8 w-8 text-orange-950"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </div>
    )  : (
        <PaginatedDataTable columns={columns} data={filteredProducts} rowsPerPage={10} />
      )}

      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={selectedProducts.length > 0 ?
          `Delete ${selectedProducts.length} selected products?` :
          'Delete this product?'}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <EditOrAddProductModal
        isOpen={isEditOpen}
        product={editingProduct}
        onClose={closeEditModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductsManagement;
