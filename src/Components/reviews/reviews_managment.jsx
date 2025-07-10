import React, { useMemo } from 'react';
import useReviews from '../../hooks/useReviews';
import ReviewFilterBar from './review_filter_bar';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import MessageBox from '../sharedComponents/MessageBox';
import { formatDate } from '../../utils/format';
import { FiTrash } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ReviewsManagement = () => {
  const {
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
    isBulkDelete
  } = useReviews();

  const columns = useMemo(() => [
    {
      label: '',
      key: 'select',
      render: (r) => (
        <input
          type="checkbox"
          checked={selectedReviews.includes(r._id)}
          onChange={() => handleReviewSelect(r._id)}
          className="h-4 w-4 accent-orange-950 border-gray-300 rounded cursor-pointer"
        />
      )
    },
    {
      label: 'Product',
      key: 'product',
      render: (r) => (
        <div>
          <div className="font-medium text-sm">{r.productId?.name || '—'}</div>
          <div className="text-xs text-gray-400">{r.productId?.category}</div>
        </div>
      )
    },
    {
      label: 'User',
      key: 'user',
      render: (r) => (
        <div>
          <div className="text-sm">{r.userId?.username || '—'}</div>
          <div className="text-xs text-gray-400">{r.userId?.email}</div>
        </div>
      )
    },
    {
      label: 'Rating',
      key: 'rating',
      render: (r) => {
        const fullStars = Math.floor(r.rating);
        const hasHalfStar = r.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
          <div className="flex items-center space-x-1 text-sm text-yellow-500">
            <div className="flex">
              {Array.from({ length: fullStars }, (_, i) => (
                <FaStar key={`full-${i}`} className="h-3 w-3" />
              ))}
              {hasHalfStar && <FaStarHalfAlt className="h-3 w-3" />}
              {Array.from({ length: emptyStars }, (_, i) => (
                <FaRegStar key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
              ))}
            </div>
          </div>
        );
      }
    },
    {
      label: 'Comment',
      key: 'comment',
      render: (r) => (
        <div
          className="max-w-[200px] truncate text-sm text-gray-700 cursor-help"
          title={r.comment} // Native tooltip
        >
          {r.comment}
        </div>
      )
    },
    {
      label: 'Date',
      key: 'date',
      render: (r) => <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (r) => (
        <button
          onClick={() => openSingleDeleteModal(r._id)}
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 cursor-pointer"
          title="Delete"
        >
          <FiTrash />
        </button>
      )
    }
  ], [selectedReviews, handleReviewSelect, openSingleDeleteModal]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        Reviews
        <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
          {reviews.length} items
        </span>
      </h1>

      <ReviewFilterBar
        search={search}
        setSearch={setSearch}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 accent-orange-950 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            {selectedReviews.length > 0 ? `${selectedReviews.length} selected` : 'Select All'}
          </span>
        </div>
        <button
          onClick={openBulkDeleteModal}
          disabled={selectedReviews.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
            selectedReviews.length > 0
              ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiTrash className="h-5 w-5 mr-2" />
          Delete Selected
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <svg className="animate-spin h-8 w-8 text-orange-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading reviews...</p>
          </div>
        </div>
      ) : (
        <PaginatedDataTable columns={columns} data={filteredReviews} rowsPerPage={10} />
      )}

      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={
          isBulkDelete
            ? `Are you sure you want to delete ${selectedReviews.length} selected reviews?`
            : 'Are you sure you want to delete this review?'
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ReviewsManagement;
