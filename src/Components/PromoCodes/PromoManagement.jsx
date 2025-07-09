import React, { useMemo, useState, useCallback } from 'react';
import usePromoCodes from '../../hooks/usePromoCodes';
import PromoFilterBar from './PromoFilterBar';
import PaginatedDataTable from '../sharedComponents/PaginatedDataTable';
import MessageBox from '../sharedComponents/MessageBox';
import EditOrAddPromoModal from './EditOrAddPromoModal';
import { formatDate } from '../../utils/format';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { updatePromoCode } from '../../services/promoService';


const PromoManagement = () => {
  const {
    loading, promoCodes, filtered,
    search, setSearch,
    sortOption, setSortOption,
    selected, selectAll, toggleSelect, handleSelectAll,
    isModalOpen, openDelete, confirmDelete,
    savePromo,setIsModalOpen,setPromoCodes
  } = usePromoCodes();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);

  const openEditor = useCallback(promo => {
    setCurrentPromo(promo);
    setIsEditOpen(true);
  }, []);

  const closeEditor = () => {
    setCurrentPromo(null);
    setIsEditOpen(false);
  };

  const columns = useMemo(() => [
    {
      label: '',
      key: 'select',
      render: p => (
        <input
          type="checkbox"
          checked={selected.includes(p._id)}
          onChange={() => toggleSelect(p._id)}
          className="h-4 w-4 accent-orange-950 border-gray-300 rounded cursor-pointer"
        />
      ),
    },
    {
      label: 'Code',
      key: 'code',
      render: p => (
        <div className="font-medium">{p.code}</div>
      ),
    },
    {
      label: 'Discount %',
      key: 'discountPercentage',
      render: p => `${p.discountPercentage}%`,
    },
    {
      label: 'Valid Until',
      key: 'validUntil',
      render: p => formatDate(p.validUntil),
    },
    {
  label: 'Active',
  key: 'isActive',
  render: p => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
        type="checkbox"
        checked={p.isActive}
        onChange={async () => {
        try {
            const newStatus = !p.isActive;
            await updatePromoCode(p._id, { isActive: newStatus });

            // Update state immutably so React re-renders
            setPromoCodes(prev =>
            prev.map(item =>
                item._id === p._id ? { ...item, isActive: newStatus } : item
            )
            );
        } catch (err) {
            console.error('Failed to update promo status', err);
            alert('Failed to update promo status.');
        }
        }}
        className="sr-only peer"
    />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 transition-all duration-300" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-full transition duration-300" />
    </label>
  )
},
    {
      label: 'Actions',
      key: 'actions',
      render: p => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditor(p)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 cursor-pointer"
            title="Edit"
          ><FiEdit /></button>
          <button
            onClick={() => openDelete(p._id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 cursor-pointer"
            title="Delete"
          ><FiTrash /></button>
        </div>
      ),
    },
  ], [selected, toggleSelect, openEditor, openDelete,setPromoCodes]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        Promo Codes
        <span className="text-sm bg-orange-50 text-orange-950 font-medium px-3 py-1 rounded-full shadow-sm">
          {promoCodes.length} Codes
        </span>
      </h1>

      <PromoFilterBar
        search={search} setSearch={setSearch}
        sortOption={sortOption} setSortOption={setSortOption}
        onAdd={() => openEditor(null)}
      />

      <div className="flex items-center justify-between bg-white px-6 py-4 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox" checked={selectAll}
            onChange={handleSelectAll}
            className="h-5 w-5 accent-orange-950 border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            {selected.length > 0 ? `${selected.length} selected` : 'Select All'}
          </span>
        </div>
        <button
          onClick={() => openDelete(null, true)}
          disabled={selected.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition ${
            selected.length > 0
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
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
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </div>
    )   : (
        <PaginatedDataTable columns={columns} data={filtered} rowsPerPage={10} />
      )}

      <MessageBox
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message={
          selected.length > 0
            ? `Delete ${selected.length} selected promo codes?`
            : 'Delete this promo code?'
        }
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <EditOrAddPromoModal
        isOpen={isEditOpen}
        promo={currentPromo}
        onClose={closeEditor}
        onSave={async data => {
          await savePromo(data);
          closeEditor();
        }}
      />
    </div>
  );
};

export default PromoManagement;
