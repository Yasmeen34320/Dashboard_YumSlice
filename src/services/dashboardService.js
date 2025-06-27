// services/dashboardService.js
import axios from 'axios';

// export const fetchDashboardData = async () => {
//   const response = await axios.get('https://your-api.com/api/admin/dashboard');
//   return response.data;
// };
export const fetchCustomers = async () => {
  const response = await axios.get('https://your-api.com/api/admin/customers');
  return response.data;
};
// export const fetchDeliveredOrders = async () => {
//     try{
//       const response = await axios.get('http://localhost:1000/orders/');
//      console.log('Response:', response.data.data);
//       const orders = response.data.data.filter(order => order.orderStatus === 'delivered');
//       console.log('Delivered Orders:', orders);
//       return orders;
//     } catch (error) {
//       console.error('Error fetching delivered orders:', error);
//       throw error;
//     }
// };
// services/dashboardService.js

export const fetchDeliveredOrders = async () => {
  try {
    const response = await axios.get('http://localhost:1000/orders/');
    const allOrders = response.data.data;

    const deliveredOrders = allOrders.filter(order => order.orderStatus === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const now = new Date();
   const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);    
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Group orders
    
    const ordersToday = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= todayStart && date < tomorrowStart;
    });

    const ordersThisMonth = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= thisMonthStart && date < nextMonthStart;
    });

    const ordersLastMonth = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= lastMonthStart && date < thisMonthStart;
    });

    const thisMonthCount = ordersThisMonth.reduce((count, order) => order.totalPrice + count, 0);
    const lastMonthCount = ordersLastMonth.reduce((count, order) => order.totalPrice + count, 0);

    const percentageChange = lastMonthCount === 0
      ? 100
      : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

    console.log('Delivered This Month:', thisMonthCount);
    console.log('Delivered Last Month:', lastMonthCount);
    console.log('Growth %:', percentageChange.toFixed(2));

    //  Top Selling Product (based on quantity from all delivered orders)
    const productQuantityMap = {};

    ordersThisMonth.forEach(order => {
      order.orderItems.forEach(item => {
        const productName = item.productId.name;
        const quantity = item.quantity;

        if (productQuantityMap[productName]) {
          productQuantityMap[productName] += quantity;
        } else {
          productQuantityMap[productName] = quantity;
        }
      });
    });

    // Get top-selling product
    const topSellingProductName = Object.keys(productQuantityMap).reduce((topProduct, currentProduct) =>
      productQuantityMap[currentProduct] > productQuantityMap[topProduct]
        ? currentProduct
        : topProduct
    , Object.keys(productQuantityMap)[0]);

    const topSellingProductQuantity = productQuantityMap[topSellingProductName];
    // const numOfTopSellingProductOrders = deliveredOrders.reduce((count, order) => {
    //   return count + order.orderItems.reduce((itemCount, item) => {
    //     return item.productId.name === topSellingProductName ? itemCount + item.quantity : itemCount;
    //   }, 0);
    // }, 0);

    // 🌟 Group by last 6 months for monthly revenue chart
    const monthlyRevenueMap = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2025-6"
      monthlyRevenueMap[key] = 0;
    }

    deliveredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthlyRevenueMap[key] !== undefined) {
        monthlyRevenueMap[key] += order.totalPrice;
      }
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([key, value]) => {
      const [year, month] = key.split('-');
      const formattedMonth = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
      return {
        date: `${formattedMonth}`, // e.g., "Jun"
        revenue: value
      };
    });

    // group by order status for order status chart
    const orderStatusMap = {
        delivered: 0,
      pending: 0,
      Returned: 0,
       preparing: 0,
      shipped: 0,
      Canceled: 0
    };
    // Delivered, Pending, Returned, Preparing , shipped ,cancelled

    allOrders.forEach(order => {
      orderStatusMap[order.orderStatus] += 1;
    });
    const orderStatusData = Object.entries(orderStatusMap).map(([status, count]) => ({
      status,
      count
    }));
    return {
        totalOrders:allOrders.length,
        orderStatusData,
      totalRevenue,
      monthlyRevenue,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      todayCount: ordersToday.length,
      topSellingProduct: {
        productName: topSellingProductName,
        quantitySold: topSellingProductQuantity
      },
      allOrders, // optional: all orders fetched
      deliveredOrders, // optional: all delivered orders
    };
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    throw error;
  }
};
