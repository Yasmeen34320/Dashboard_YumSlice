import React, { useEffect, useState, useMemo } from 'react';
import {
  getAllUsers,
  getEmailVerificationStatus,
  getUserOrderStats,
} from '../services/customerService';
import FilterBar from './sharedComponents/customer_filter_bar';
import DataTable from './sharedComponents/data_table';
import Customer from '../models/Customer';

const getHSLColorsFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bgColor: `hsl(${hue}, 80%, 85%)`,
    textColor: `hsl(${hue}, 60%, 25%)`,
  };
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('az');
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchUsers = async () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredCustomers = customers
    .filter((u) => {
      const matchesSearch = u.username?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'az':
          return a.username.localeCompare(b.username);
        case 'za':
          return b.username.localeCompare(a.username);
        case 'ordersAsc':
          return a.totalOrders - b.totalOrders;
        case 'ordersDesc':
          return b.totalOrders - a.totalOrders;
        case 'spentAsc':
          return a.totalSpent - b.totalSpent;
        case 'spentDesc':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });

  // Handle individual customer selection
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  // Handle select all customers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle delete selected customers
  const handleDeleteSelected = () => {
    // Implement delete logic here
    console.log('Deleting selected customers:', selectedCustomers);
    // After deletion
    // 1. Refresh the customer list
    // 2. Clear the selection
    setSelectedCustomers([]);
    setSelectAll(false);
  };

  // Table columns definition
  const columns = useMemo(() => [
    {
      label: '',
      key: 'select',
      render: (customer) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(customer._id)}
          onChange={() => handleCustomerSelect(customer._id)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      ),
    },
    {
      label: 'Customer Name',
      key: 'username',
      render: (customer) => {
        const { bgColor, textColor } = getHSLColorsFromName(customer.username);
        return (
          <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-start">
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full font-bold mb-1 sm:mb-0"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {customer.username.charAt(0).toUpperCase()}
            </div>
            <div className="sm:ml-4 text-center sm:text-left">
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
      label: 'Total',
      key: 'totalSpent',
      render: (c) => `EGP ${c.totalSpent.toFixed(2)}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (c) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            c.status === 'Verified'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'actions',
      render: () => (
        <button
          title="Delete"
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      ),
    },
  ], [selectedCustomers]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>

      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Selection actions bar */}
<div className="flex items-center justify-between bg-gray-50 px-4 py-3 mb-4 rounded-lg border border-gray-200">
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={selectAll}
      onChange={handleSelectAll}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="ml-2 text-sm text-gray-700">
      {selectedCustomers.length > 0 
        ? `${selectedCustomers.length} selected` 
        : 'Select All'}
    </span>
  </div>
  
  <button
    onClick={handleDeleteSelected}
    disabled={selectedCustomers.length === 0}
    className={`text-sm font-medium flex items-center ${
      selectedCustomers.length > 0 
        ? 'text-red-600 hover:text-red-800' 
        : 'text-gray-400 cursor-not-allowed'
    }`}
  >
    <svg
      className="h-5 w-5 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      ></path>
    </svg>
    Delete Selected
  </button>
</div>

      {loading ? (
        <div className="text-gray-500">Loading customers...</div>
      ) : (
        <DataTable title="Customer List" data={filteredCustomers} columns={columns} />
      )}
    </div>
  );
};

export default CustomersManagement;