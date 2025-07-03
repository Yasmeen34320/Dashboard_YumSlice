import { useEffect, useState } from 'react';
import {
  getAllProducts,
  deleteProductById,
} from '../services/productService';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('az');
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllProducts();
      setProducts(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter((p) => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'all' || p.category === categoryFilter)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'az': return a.name.localeCompare(b.name);
        case 'za': return b.name.localeCompare(a.name);
        case 'priceLow': return a.price - b.price;
        case 'priceHigh': return b.price - a.price;
        case 'rating': return b.totalRating - a.totalRating;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt); 
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt); 
        default: return 0;
      }
    });

  const handleProductSelect = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedProducts(selectAll ? [] : filteredProducts.map(p => p._id));
  };

  const openSingleDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsBulkDelete(false);
    setIsModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setIsModalOpen(true);
  };

  const handleModalConfirm = async () => {
    try {
      if (isBulkDelete) {
        await Promise.all(selectedProducts.map(id => deleteProductById(id)));
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
        setSelectedProducts([]);
        setSelectAll(false);
      } else {
        await deleteProductById(deleteTargetId);
        setProducts(prev => prev.filter(p => p._id !== deleteTargetId));
      }
    } finally {
      setIsModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setDeleteTargetId(null);
  };

  return {
    loading,
    filteredProducts,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    sortOption, setSortOption,
    selectedProducts, selectAll,
    handleProductSelect, handleSelectAll,
    openSingleDeleteModal, openBulkDeleteModal,
    isModalOpen, isBulkDelete,
    handleModalConfirm, handleModalCancel,
    setProducts
  };
};

export default useProducts;
