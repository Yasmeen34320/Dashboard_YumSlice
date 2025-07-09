import { useEffect, useState } from 'react';
import {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from '../services/promoService';


const usePromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    (async () => {
      const data  = await getAllPromoCodes();
      setPromoCodes(data);
      setLoading(false);
    })();
  }, []);

  const filtered = promoCodes
    .filter(p =>
      p.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'codeAz') return a.code.localeCompare(b.code);
      if (sortOption === 'codeZa') return b.code.localeCompare(a.code);
      return 0;
    });

  const toggleSelect = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelected(!selectAll ? filtered.map(p => p._id) : []);
  };

  const openDelete = (id, bulk = false) => {
    setDeleteTargetId(id);
    setIsBulkDelete(bulk);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (isBulkDelete) {
      await Promise.all(selected.map(id => deletePromoCode(id)));
      setPromoCodes(pc => pc.filter(p => !selected.includes(p._id)));
      setSelected([]);
      setSelectAll(false);
    } else {
      await deletePromoCode(deleteTargetId);
      setPromoCodes(pc => pc.filter(p => p._id !== deleteTargetId));
    }
    setIsModalOpen(false);
  };

  const savePromo = async promo => {
    const { _id } = promo;
    if (_id) {
      const { data } = await updatePromoCode(_id, promo);
      setPromoCodes(pc => pc.map(p => (p._id === _id ? data : p)));
    } else {
      const { data } = await createPromoCode(promo);
      setPromoCodes(pc => [data, ...pc]);
    }
  };

  return {
    loading, promoCodes, filtered,
    search, setSearch,
    sortOption, setSortOption,
    selected, selectAll, toggleSelect, handleSelectAll,
    isModalOpen, openDelete, confirmDelete,
    savePromo,setIsModalOpen,setPromoCodes
  };
};

export default usePromoCodes;
