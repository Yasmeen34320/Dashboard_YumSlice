import React, { useMemo } from 'react';
import { FiTrash } from 'react-icons/fi';
import useOrders from '../../hooks/useOrders';
import MessageBox from '../sharedComponents/MessageBox';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import { formatDate } from '../../utils/format';
import OrderFilterBar from './order_filter_bar';

const OrdersManagement = () => {
  const {
    orders,
    loading,
    selectedOrders,
    selectAll,
    isModalOpen,
    isBulkDelete,
    handleOrderSelect,
    handleSelectAll,
    openSingleDeleteModal,
    openBulkDeleteModal,
    handleModalConfirm,
    handleModalCancel,
    handleStatusChange,
    setStatusFilter,
    statusFilter,
    setSearch,
    search,
    filtered
  } = useOrders();

  const columns = useMemo(() => [
    {
      label: '',
      key: 'select',
      render: (o) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(o._id)}
          onChange={() => handleOrderSelect(o._id)}
          className="h-4 w-4 accent-orange-950 border-gray-300 rounded cursor-pointer"
        />
      )
    },
    {
      label: 'Customer Email',
      key: 'user',
      render: (o) => {
        return <div className="text-sm font-medium text-gray-900">{o.userId?.email || 'N/A'}</div>

      },
    },
    {
      label: 'Items',
      key: 'items',
      render: (o) =>
        o.orderItems.map((item, i) => (
          <div key={i} className="text-xs">
            {item.productId?.name} × {item.quantity}
          </div>
        ))
    },
   {
  label: 'Status',
  key: 'status',
  render: (o) => (
    <select
      value={o.orderStatus}
      onChange={(e) => handleStatusChange(o._id, e.target.value)}
      className={`text-xs font-medium rounded-md px-2 py-1 border transition-all duration-200
        ${
          o.orderStatus === 'delivered'
            ? 'bg-green-100 text-green-800 border-green-300'
            : o.orderStatus === 'pending'
            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
            : o.orderStatus === 'preparing'
            ? 'bg-blue-100 text-blue-800 border-blue-300'
            : o.orderStatus === 'shipped'
            ? 'bg-purple-100 text-purple-800 border-purple-300'
            : o.orderStatus === 'Canceled'
            ? 'bg-red-100 text-red-800 border-red-300'
            : o.orderStatus === 'Returned'
            ? 'bg-gray-100 text-gray-800 border-gray-300'
            : ''
        }`}
    >
      {['pending', 'preparing', 'shipped', 'delivered', 'Canceled', 'Returned'].map((status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  )
},
    {
      label: 'Total (EGP)',
      key: 'total',
      render: (o) => `${o.totalPrice.toFixed(2)}`
    },
   {
      label: 'Payment',
      key: 'payment',
      render: (o) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full
            ${
              o.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
        >
          {o.paymentStatus === 'paid' ? 'Paid' : 'On Delivery'}
        </span>
      )
    },
    {
      label: 'Created At',
      key: 'createdAt',
      render: (o) => formatDate(o.createdAt)
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (o) => (
        <button
          onClick={() => openSingleDeleteModal(o._id)}
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 cursor-pointer"
          title="Delete"
        >
          <FiTrash />
        </button>
      )
    }
  ], [selectedOrders, handleOrderSelect, handleStatusChange, openSingleDeleteModal]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        Orders
        <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
          {orders.length} items
        </span>
      </h1>

      
      <OrderFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Bulk Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 accent-orange-950 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            {selectedOrders.length > 0 ? `${selectedOrders.length} selected` : 'Select All'}
          </span>
        </div>
        <button
          onClick={openBulkDeleteModal}
          disabled={selectedOrders.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
            selectedOrders.length > 0
              ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiTrash className="h-5 w-5 mr-2" />
          Delete Selected
        </button>
      </div>
      {/* Table or Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <svg className="animate-spin h-8 w-8 text-orange-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading orders...</p>
          </div>
        </div>
      ) : (
        <PaginatedDataTable columns={columns} data={filtered} rowsPerPage={10} />
      )}

      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={isBulkDelete
          ? `Delete ${selectedOrders.length} selected orders?`
          : 'Are you sure you want to delete this order?'}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default OrdersManagement;
