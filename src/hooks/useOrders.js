import { useEffect, useState } from 'react';
import { fetchOrders, deleteOrder, updateOrderStatus } from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((order) =>
        order.userId?.email?.toLowerCase().includes(q) ||
        order.orderItems?.some(item =>
          item.productId?.name?.toLowerCase().includes(q)
        )
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    setFiltered(result);
  }, [orders, search, statusFilter]);

  const handleOrderSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedOrders(!selectAll ? filtered.map((o) => o._id) : []);
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
    if (isBulkDelete) {
      await Promise.all(selectedOrders.map((id) => deleteOrder(id)));
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
      setSelectedOrders([]);
      setSelectAll(false);
    } else {
      await deleteOrder(deleteTargetId);
      setOrders((prev) => prev.filter((o) => o._id !== deleteTargetId));
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => setIsModalOpen(false);

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o
      )
    );
  };

  return {
    orders,
    filtered,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
    setOrders,
  };
};

export default useOrders;
