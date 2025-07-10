import { useState, useEffect } from 'react';
import { fetchReviews, deleteReview } from '../services/reviewService';

const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Fetch Reviews
  useEffect(() => {
    (async () => {
      const data = await fetchReviews();
      setReviews(data);
      setLoading(false);
    })();
  }, []);

  // Apply search + sort
  useEffect(() => {
    let result = [...reviews];

    if (search.trim()) {
      result = result.filter((r) =>
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
        r.userId?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'ratingHigh':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLow':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    setFilteredReviews(result);
  }, [reviews, search, sortOption]);

  // Selection logic
  const handleReviewSelect = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedReviews(!selectAll ? filteredReviews.map((r) => r._id) : []);
  };

  // Delete logic
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
    if (isBulkDelete) {
      await Promise.all(selectedReviews.map((id) => deleteReview(id)));
      setReviews((prev) => prev.filter((r) => !selectedReviews.includes(r._id)));
      setSelectedReviews([]);
      setSelectAll(false);
    } else {
      await deleteReview(deleteTargetId);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTargetId));
    }

    setIsModalOpen(false);
  };

  const handleModalCancel = () => setIsModalOpen(false);

  return {
    reviews,
    filteredReviews,
    loading,
    search,
    setSearch,
    sortOption,
    setSortOption,
    selectedReviews,
    selectAll,
    handleReviewSelect,
    handleSelectAll,
    openSingleDeleteModal,
    openBulkDeleteModal,
    handleModalConfirm,
    handleModalCancel,
    isModalOpen,
    isBulkDelete,
    setReviews
  };
};

export default useReviews;
