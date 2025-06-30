// services/dashboardService.js
import axios from 'axios';
const baseUrl = "http://localhost:1000";

export const fetchReviews = async () => {
  const response = await axios.get(`${baseUrl}/reviews/`);
  console.log(`reviews ${response.data.toString()}`);
  console.log(response.data.data);

  return response.data.data;
};

export const fetchDeliveredOrders = async () => {
  try {
    const response = await axios.get(`${baseUrl}/orders/`);
    const allOrders = response.data.data;

    console.log(`response from orders`);
    console.log(allOrders);

    const deliveredOrders = allOrders.filter(order => order.orderStatus === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Orders by day
    const ordersToday = allOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= todayStart && date < tomorrowStart;
    });

    const ordersYesterday = allOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= yesterdayStart && date < todayStart;
    });

    const ordersTodayCount = ordersToday.length;
    const ordersYesterdayCount = ordersYesterday.length;

    const percentageChangeday = ordersYesterdayCount === 0
      ? 100
      : ((ordersTodayCount - ordersYesterdayCount) / ordersYesterdayCount) * 100;

    // Orders by month
    const ordersThisMonth = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= thisMonthStart && date < nextMonthStart;
    });

    const ordersLastMonth = deliveredOrders.filter(order => {
      const date = new Date(order.createdAt);
      return date >= lastMonthStart && date < thisMonthStart;
    });

    const thisMonthCount = ordersThisMonth.reduce((count, order) => count + (order.totalPrice ?? 0), 0);
    const lastMonthCount = ordersLastMonth.reduce((count, order) => count + (order.totalPrice ?? 0), 0);

    const percentageChange = lastMonthCount === 0
      ? 100
      : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

    console.log('Delivered This Month:', thisMonthCount);
    console.log('Delivered Last Month:', lastMonthCount);
    console.log('Growth %:', percentageChange.toFixed(2));

    // Top Selling Product
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

    let topSellingProductName = '';
    let topSellingProductQuantity = 0;

    const productNames = Object.keys(productQuantityMap);
    if (productNames.length > 0) {
      topSellingProductName = productNames.reduce((topProduct, currentProduct) =>
        productQuantityMap[currentProduct] > productQuantityMap[topProduct]
          ? currentProduct
          : topProduct
      );
      topSellingProductQuantity = productQuantityMap[topSellingProductName];
    }

    // Monthly Revenue for past 6 months
    const monthlyRevenueMap = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyRevenueMap[key] = 0;
    }

    deliveredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthlyRevenueMap[key] !== undefined) {
        monthlyRevenueMap[key] += order.totalPrice ?? 0;
      }
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([key, value]) => {
      const [year, month] = key.split('-');
      const formattedMonth = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
      return {
        date: `${formattedMonth}`,
        revenue: value
      };
    });

    // Group by order status
    const orderStatusMap = {
      delivered: 0,
      pending: 0,
      Returned: 0,
      preparing: 0,
      shipped: 0,
      Canceled: 0
    };

    allOrders.forEach(order => {
      const status = order.orderStatus;
      if (orderStatusMap.hasOwnProperty(status)) {
        orderStatusMap[status] += 1;
      } else {
        orderStatusMap[status] = 1; // for any unexpected statuses
      }
    });

    const orderStatusData = Object.entries(orderStatusMap).map(([status, count]) => ({
      status,
      count
    }));
    // console.log(allOrders)
    const recentOrders = [...allOrders]
  .filter(order => order.createdAt) 
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 


  // group by category 

   // Group by order status
    const orderCategoryMap = {
      Birthday: 0,
      Wedding: 0,
      Custom: 0,
      Cheesecakes: 0,
      "Molten Cakes": 0,
      Cupcakes: 0
    };
// ["Birthday","Wedding" , "Custom","Cheesecakes" , "Cupcakes" , "Molten Cakes"]
    deliveredOrders.forEach(order => {
      order.orderItems.forEach(product=>{
       // console.log('products')
       // console.log(product.productId.category)
  const category = product.productId.category;
      if (orderCategoryMap.hasOwnProperty(category)) {
        orderCategoryMap[category] += 1;
      } else {
        orderCategoryMap[category] = 1; // for any unexpected statuses
      }
      })
    
    });

    const orderCategoryData = Object.entries(orderCategoryMap).map(([category, count]) => ({
      category,
      count
    }));
    console.log('product data')
    console.log(orderCategoryData)
    return {
      orderCategoryData,
      recentOrders,
      totalOrders: allOrders.length,
      orderStatusData,
      percentageChangeday:parseFloat(percentageChangeday.toFixed(2)),
      totalRevenue,
      monthlyRevenue,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      todayCount: ordersTodayCount,
      topSellingProduct: {
        productName: topSellingProductName,
        quantitySold: topSellingProductQuantity
      },
      allOrders,
      deliveredOrders
    };
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    throw error;
  }
};



// const API_URL = 'https://your-api-endpoint.com/data'; // Replace with your API

export const fetchProductData = async () => {
  const response = await axios.get(`${baseUrl}/products`);
  const products = response.data.data;
  const categories = new Set(products.map((prod)=>prod.category));
  console.log('from fetch')
  console.log(products);
  return {
    categories , 
    products
  };
};


export const fetchCustomerData = async () => {
  const response = await axios.get(`${baseUrl}/users`);
  return response.data.data;
};