import { useEffect, useState } from 'react';
import { fetchAdmins, createAdmin, deleteAdmin } from '../services/adminService';
import { useAuth } from '../Context/auth_context';

const MASTER_EMAIL = 'admin@yumslice.com';

const useAdmins = () => {
  const { authUser } = useAuth(); // get currently logged-in user
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchAdmins();
      setAdmins(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let result = [...admins];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter((a) => a.email.toLowerCase().includes(lower));
    }

    result.sort((a, b) => {
      if (sortOption === 'az') return a.email.localeCompare(b.email);
      if (sortOption === 'za') return b.email.localeCompare(a.email);
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    setFilteredAdmins(result);
  }, [admins, search, sortOption]);

  const handleAdminSelect = (uid) => {
    const admin = admins.find((a) => a.uid === uid);
    if (!admin || admin.email === MASTER_EMAIL || admin.email === authUser?.email) return;
    setSelectedAdmins((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    const eligible = filteredAdmins.filter(
      (a) => a.email !== MASTER_EMAIL && a.email !== authUser?.email
    );
    setSelectAll(!selectAll);
    setSelectedAdmins(!selectAll ? eligible.map((a) => a.uid) : []);
  };

  const openSingleDeleteModal = (uid) => {
    const admin = admins.find((a) => a.uid === uid);
    if (admin.email === MASTER_EMAIL || admin.email === authUser?.email) return;
    setDeleteTargetId(uid);
    setIsBulkDelete(false);
    setIsModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setIsModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (isBulkDelete) {
      const toDelete = selectedAdmins.filter((uid) => {
        const admin = admins.find((a) => a.uid === uid);
        return admin.email !== MASTER_EMAIL && admin.email !== authUser?.email;
      });
      await Promise.all(toDelete.map((uid) => deleteAdmin(uid)));
      setAdmins((prev) => prev.filter((a) => !toDelete.includes(a.uid)));
      setSelectedAdmins([]);
      setSelectAll(false);
    } else {
      const targetAdmin = admins.find((a) => a.uid === deleteTargetId);
      if (
        targetAdmin?.email !== MASTER_EMAIL &&
        targetAdmin?.email !== authUser?.email
      ) {
        await deleteAdmin(deleteTargetId);
        setAdmins((prev) => prev.filter((a) => a.uid !== deleteTargetId));
      }
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => setIsModalOpen(false);

  const addAdmin = async (email, password) => {
    const newAdmin = await createAdmin(email, password);
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  return {
    loading,
    admins,
    filteredAdmins,
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
    search,
    setSearch,
    sortOption,
    setSortOption,
    authUser
  };
};

export default useAdmins;
