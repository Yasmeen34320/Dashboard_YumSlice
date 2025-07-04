import { useEffect, useState, useMemo } from 'react';
import {
  deleteUserById,
  getAllUsers,
  getEmailVerificationStatus,
  getUserOrderStats,
} from '../services/customerService';
import Customer from '../models/Customer';

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('az');
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);


  const fetchCustomers = async () => {
    try {
      const rawUsers = await getAllUsers();
      const usersWithStatus = await Promise.all(
        rawUsers.map(async (userData) => {
          const user = new Customer(userData);
          try {
            const isVerified = await getEmailVerificationStatus(user.uid);
            user.status = isVerified ? 'Verified' : 'Unverified';
          } catch {
            user.status = 'Unknown';
          }
          try {
            const stats = await getUserOrderStats(user._id);
            user.totalOrders = stats.totalOrders;
            user.totalSpent = stats.totalSpent;
          } catch {
            user.totalOrders = 0;
            user.totalSpent = 0;
          }
          return user;
        })
      );
      setCustomers(usersWithStatus);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers
    // .filter((u)=> u.role == 'user')
    .filter((u) => {
      const matchesSearch = u.username?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'az': return a.username.localeCompare(b.username);
        case 'za': return b.username.localeCompare(a.username);
        case 'ordersAsc': return a.totalOrders - b.totalOrders;
        case 'ordersDesc': return b.totalOrders - a.totalOrders;
        case 'spentAsc': return a.totalSpent - b.totalSpent;
        case 'spentDesc': return b.totalSpent - a.totalSpent;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        default: return 0;
      }
    });
  }, [customers, search, statusFilter, sortOption]);

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prev => prev.includes(customerId)
      ? prev.filter(id => id !== customerId)
      : [...prev, customerId]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c._id));
    }
    setSelectAll(!selectAll);
  };

  const openSingleDeleteModal = (userId) => {
    setDeleteTargetId(userId);
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
        await Promise.all(selectedCustomers.map((id) => deleteUserById(id)));
        setCustomers(prev => prev.filter(c => !selectedCustomers.includes(c._id)));
        setSelectedCustomers([]);
        setSelectAll(false);
      } else {
        await deleteUserById(deleteTargetId);
        setCustomers(prev => prev.filter(c => c._id !== deleteTargetId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete.');
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
    filteredCustomers,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortOption, setSortOption,
    selectedCustomers,
    selectAll,
    handleCustomerSelect,
    handleSelectAll,
    openSingleDeleteModal,
    openBulkDeleteModal,
    isModalOpen,
    handleModalConfirm,
    handleModalCancel,
    setIsModalOpen,
    isBulkDelete,
    customers
  };
}
