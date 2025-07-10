import React, { useMemo } from 'react';
import CustomerFilterBar from './customer_filter_bar';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import MessageBox from '../sharedComponents/MessageBox';
import Customer from '../../models/Customer';
import useCustomers from '../../hooks/useCustomers';
import { getHSLColorsFromName, formatDate } from '../../utils/format';
import { FiTrash, FiEdit } from 'react-icons/fi';


const CustomersManagement = () => {
 const {
    loading, filteredCustomers, search, setSearch, statusFilter, setStatusFilter,
    sortOption, setSortOption, selectedCustomers, selectAll,
    handleModalConfirm, openSingleDeleteModal, openBulkDeleteModal, isModalOpen,
    handleCustomerSelect, handleSelectAll, isBulkDelete,handleModalCancel,customers
  } = useCustomers();

  const columns = useMemo(() => [
    {
      label: '',
      key: '',
      render: (customer) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(customer._id)}
          onChange={() => handleCustomerSelect(customer._id)}
          className="h-4 w-4 accent-orange-950 border-gray-300 rounded cursor-pointer"
        />
      ),
    },
    {
      label: 'Customer Name',
      key: 'username',
      render: (customer) => {
        const { bgColor, textColor } = getHSLColorsFromName(customer.username);
        return (
          <div className="flex items-center">
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full font-bold"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {customer.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{customer.username}</div>
              <div className="text-xs text-gray-400">{formatDate(customer.createdAt)}</div>
            </div>
          </div>
        );
      },
    },
    { label: 'Email', key: 'email' },
    {
      label: 'Phone',
      key: 'phoneNumber',
      render: (c) => c.phoneNumber || '-',
    },
    { label: 'Orders', key: 'totalOrders' },
    {
      label: 'Total (EGP)',
      key: 'totalSpent',
      render: (c) => `${c.totalSpent.toFixed(2)}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (c) => (
        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
          c.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {c.status}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (customer) => (
        <button
          title="Delete"
          onClick={() => openSingleDeleteModal(customer._id)}
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 cursor-pointer"
        >
        <FiTrash />
        </button>
      ),
    },
  ], [selectedCustomers,handleCustomerSelect,openSingleDeleteModal]);

  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      Customers
      <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
        {customers.length} Users
      </span>
    </h1>
      <CustomerFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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
        {selectedCustomers.length > 0
          ? `${selectedCustomers.length} selected`
          : 'Select All'}
      </span>
    </div>

  <button
    onClick={openBulkDeleteModal}
    disabled={selectedCustomers.length === 0}
    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
      selectedCustomers.length > 0
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
          <p className="text-gray-500 text-sm">Loading customers...</p>
        </div>
      </div>
    ) : (
      <PaginatedDataTable data={filteredCustomers} columns={columns} rowsPerPage={10} />
    )}


      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={
          isBulkDelete
            ? `Are you sure you want to delete ${selectedCustomers.length} selected users?`
            : 'Are you sure you want to delete this user?'
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default CustomersManagement;
