import React, { useMemo, useState } from 'react';
import useAdmins from '../../hooks/useAdmins';
import MessageBox from '../sharedComponents/MessageBox';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import { FiTrash, FiPlus } from 'react-icons/fi';
import AdminFilterBar from './AdminFilterBar';
import { formatDate, getHSLColorsFromName } from '../../utils/format';
import AddAdminModal from './AddAdminModal';


const AdminManagement = () => {
  const {
    filteredAdmins,
    loading,
    search,
    setSearch,
    sortOption,
    setSortOption,
    selectedAdmins,
    selectAll,
    handleAdminSelect,
    handleSelectAll,
    openSingleDeleteModal,
    openBulkDeleteModal,
    handleModalConfirm,
    handleModalCancel,
    isModalOpen,
    isBulkDelete,
    addAdmin,
    admins,authUser
  } = useAdmins();

  const [showAddModal, setShowAddModal] = useState(false);

  

  const columns = useMemo(
    () => [
      {
      label: '',
      key: 'select',
      render: (a) => {
        const isProtected = a.email === 'admin@yumslice.com' || a.email === authUser?.email;
        return (
          <input
            type="checkbox"
            checked={selectedAdmins.includes(a.uid)}
            onChange={() => handleAdminSelect(a.uid)}
            className="h-4 w-4 accent-orange-950 rounded cursor-pointer"
            disabled={isProtected}
          />
        );
      },
    },
      {
        label: 'Email',
        key: 'email',
        render: (a) => {
         const username = a.email.split('@')[0];
         const { bgColor, textColor } = getHSLColorsFromName(username);
        return (
                <div className="flex items-center space-x-4">
        {/* Avatar Circle */}
        <div
          className="h-10 w-10 flex items-center justify-center rounded-full font-semibold text-sm uppercase shadow-sm"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {username.charAt(0)}
        </div>

            {/* Email and Role */}
            <div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                {a.email}
                {a.email === authUser?.email && (
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    YOU
                  </span>
                )}
                {a.email === 'admin@yumslice.com' && (
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    MASTER
                  </span>
                )}
              </div>
            </div>
          </div>

               );
      },
    },
      {
        label: 'Created At',
        key: 'createdAt',
        render: (a) => formatDate(a.createdAt || Date.now())
    },  
    {
      label: 'Actions',
      key: 'actions',
      render: (a) => {
        const isProtected = a.email === 'admin@yumslice.com';
        return isProtected ? (
            <span className="text-gray-400 text-sm">Protected</span>
          ) : a.email === authUser?.email ? (
            <span className="text-gray-300 text-sm">You</span>
          ) : (
            <button
              onClick={() => openSingleDeleteModal(a.uid)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <FiTrash />
            </button>
          );

      },
    }
    ],
    [selectedAdmins, handleAdminSelect, openSingleDeleteModal,authUser]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">Admin Management 
          <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
        {admins.length} admins
      </span>
      </h1>

      {/* Filter Section */}
      <AdminFilterBar
        search={search}
        setSearch={setSearch}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onAddAdmin={() => setShowAddModal(true)}
        />


      {/* Bulk Actions */}
      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 accent-orange-950 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            {selectedAdmins.length > 0
              ? `${selectedAdmins.length} selected`
              : 'Select All'}
          </span>
        </div>
        <button
          onClick={openBulkDeleteModal}
          disabled={selectedAdmins.length === 0}
          className=
          {`flex items-center px-4 py-2 rounded-lg transition-all duration-150 ${
            selectedAdmins.length > 0
        ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer'
        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
    }`}
        >
          <FiTrash className="mr-1 inline" />
          Delete Selected
        </button>
      </div>

      {/* Table or Loader */}
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
          <p className="text-gray-500 text-sm">Loading admins...</p>
        </div>
      </div>
    ) : (
        <PaginatedDataTable data={filteredAdmins} columns={columns} rowsPerPage={10} />
      )}

      {/* Delete Confirmation Modal */}
      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={
          isBulkDelete
            ? `Are you sure you want to delete ${selectedAdmins.length} selected admins?`
            : 'Are you sure you want to delete this admin?'
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <AddAdminModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={async (email, password) => {
            await addAdmin(email, password);
            setShowAddModal(false);
        }}
        />

    </div>
  );
};

export default AdminManagement;
