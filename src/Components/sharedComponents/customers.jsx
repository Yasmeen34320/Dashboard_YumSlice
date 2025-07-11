import { useQuery } from '@tanstack/react-query';
import { fetchCustomerData, fetchDeliveredOrders } from '../../services/dashboardService';
import { data, Link } from 'react-router-dom';



const processTopCustomers = (orders) => {
  const map = new Map();

  orders.forEach(order => {
    const userId = order.userId._id;
    const username = order.userId.username;
    if (!map.has(userId)) {
      map.set(userId, { name: username, orders: 0, revenue: 0 });
    }
    const customer = map.get(userId);
    customer.orders += 1;
    customer.revenue += order.totalPrice;
  });

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3); // top 3 customers
};

const Customers = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchDeliveredOrders
  });
  const {data:customerss , isLoading:isLoading1 , isError}=useQuery({
    queryKey:['customers'],
    queryFn:fetchCustomerData
  })

  if (isLoading || isLoading1) return <p>Loading...</p>;
const {deliveredOrders}=orders;
  const topCustomers = processTopCustomers(deliveredOrders);
      const now = new Date();

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const customersThisMonth=customerss.filter(customer => {
      const date = new Date(customer.createdAt);
      return date >= thisMonthStart && date < nextMonthStart;
    });

    return (
<div className="bg-white rounded-xl shadow-md tracking-[.1em] p-5 w-full max-w-sm h-[300px]">
      <div className="flex justify-between items-center mb-4 tracking-[.1em]">
        <h3 className="text-base font-semibold text-gray-700">Customers</h3>
        <Link to="/users" className="text-sm text-blue-500 underline hover:underline font-semibold tracking-[.1em]">View All</Link>
      </div>

      {/* Summary */}
      <div className="flex justify-between text-center mb-6">
        <div>
          <p className="text-xl font-bold text-gray-900">{customerss.length}</p>
          <p className="text-xs text-gray-500">Total Customers</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{customersThisMonth.length}</p>
          <p className="text-xs text-gray-500">New This Month</p>
        </div>
       
      </div>

      {/* Top Customers */}
      <p className="text-sm font-semibold text-gray-700 mb-3">Top Customers</p>
      <div className="space-y-3">
        {topCustomers.map((c, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full text-white text-sm font-semibold flex justify-center items-center"
                 style={{ backgroundColor: ['#BFDBFE', '#E9D5FF', '#BBF7D0'][i] }}>
              {c.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-500">{c.orders} orders</p>
            </div>
          </div>
          <p className="font-semibold text-sm text-gray-800">${c.revenue.toLocaleString()}</p>
        </div>
      ))}
    </div>
    </div>
  );
};
export default Customers