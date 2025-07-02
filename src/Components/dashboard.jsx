// Dashboard.jsx
import React from 'react';
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { PiHandbagFill } from "react-icons/pi";
import { RiCake2Line } from "react-icons/ri";
import { useQuery } from '@tanstack/react-query';
import { fetchDeliveredOrders, fetchReviews } from '../services/dashboardService';

import MonthlyRevenueChart from './sharedComponents/monthly_revenue_chart';
import OrderStatusPieChart from './sharedComponents/order_status_chart';
import RecentOrdersTable from './sharedComponents/recent_orders_table';
import LatestReviews from './sharedComponents/latest_review';
import BarChart from './sharedComponents/bar_chart';
import LowStockAlert from './sharedComponents/low_stock_alert';
import Customers from './sharedComponents/customers';

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchDeliveredOrders
  });

  const { data: reviews, isLoading: isLoading1, isError: isError1 } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews
  });

  if (isLoading || isLoading1) return <p>Loading...</p>;
  if (isError || isError1) return <p>Error loading dashboard data</p>;

  // Destructure with fallbacks to avoid crashes
  const {
    recentOrders=[],
    percentageChangeday = 0,
    totalOrders = 0,
    orderStatusData = [],
    monthlyRevenue = [],
    topSellingProduct = { productName: 'N/A', quantitySold: 0 },
    totalRevenue = 0,
    todayCount = 0,
    percentageChange = 0,
    allOrders = []
  } = data || {};

  return (
    <div className='w-full h-full flex justify-center flex-col'>
      <h1 className='text-xl font-semibold tracking-[.1em]'>Dashboard</h1>
      <p className='text-gray-600 font-semibold tracking-[.05em] text-sm'>
        Welcome back, James! Here's what's happening with your cake store today.
      </p>

      <div className='w-full tracking-[.1em] flex flex-col md:flex-row justify-center gap-2 items-center mt-4'>
        {/* Total Revenue Card */}
        <div className='w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg m-2' style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <div className='flex justify-between items-center'>
            <div className='p-4 flex flex-col gap-2'>
              <h2 className='text-gray-500 font-semibold text-sm'>Total Revenues</h2>
              <p className='font-semibold text-xl'>${totalRevenue}</p>
            </div>
            <div className='p-4 rounded-full bg-orange-50 mr-10 flex items-center justify-center' style={{ width: '50px', height: '50px' }}>
              <LuCircleDollarSign className='text-orange-950' />
            </div>
          </div>
          <div className="flex-1"></div>
          <div className='flex justify-between px-4 py-4'>
            <div className='flex gap-1 items-center'>
              {percentageChange > 0 ? <FaLongArrowAltUp className='text-green-500' /> : <FaLongArrowAltDown className='text-red-500' />}
              <p className={`font-semibold ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(percentageChange)}%
              </p>
            </div>
            <p className='text-gray-500 text-sm'>vs last month</p>
          </div>
        </div>

        {/* Orders Today Card */}
        <div className='w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg m-2' style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <div className='flex justify-between items-center'>
            <div className='p-4 flex flex-col gap-2'>
              <h2 className='text-gray-500 font-semibold text-sm'>Orders Today</h2>
              <p className='font-semibold text-xl'>{todayCount}</p>
            </div>
            <div className='p-4 rounded-full bg-green-50 mr-10 flex items-center justify-center' style={{ width: '50px', height: '50px' }}>
              <PiHandbagFill className='text-green-500' />
            </div>
          </div>
          <div className="flex-1"></div>
          <div className='flex justify-between px-4 pb-4'>
            <div className='flex gap-1 items-center'>
              {percentageChangeday > 0 ? <FaLongArrowAltUp className='text-green-500' /> : <FaLongArrowAltDown className='text-red-500' />}
              <p className={`font-semibold ${percentageChangeday > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(percentageChangeday)}%
              </p>
            </div>
            <p className='text-gray-500 text-sm'>vs Yesterday</p>
          </div>
        </div>

        {/* Top Selling Product Card */}
        <div className='w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg m-2' style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <div className='flex justify-between items-center'>
            <div className='p-4 flex flex-col gap-2'>
              <h2 className='text-gray-500 font-semibold text-sm'>Top Selling Product</h2>
              <p className='font-semibold text-lg'>{topSellingProduct.productName || 'N/A'}</p>
            </div>
            <div className='p-4 rounded-full bg-purple-50 mr-10 flex items-center justify-center' style={{ width: '50px', height: '50px' }}>
              <RiCake2Line className='text-purple-950' />
            </div>
          </div>
          <div className="flex-1"></div>
          <div className='flex justify-between px-4 pb-4'>
            <p className='text-gray-500 text-sm'>
              {topSellingProduct.quantitySold || 0} orders this month
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='flex md:gap-8 flex-col md:flex-row justify-between'>
        <MonthlyRevenueChart data={monthlyRevenue} />
        <OrderStatusPieChart
          data={orderStatusData}
          totalOrders={totalOrders}
          avgOrderValue={totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0}
        />
      </div>

      {/* Recent Orders & Reviews */}
      <div className='flex gap-2 w-full flex-col md:flex-row'>
        <RecentOrdersTable orders={(recentOrders || []).slice(0, 4)} />
        <LatestReviews data={reviews} />
      </div>
      <div className='flex flex-col gap-2 mb-10 w-full h-[700px] bg-white  rounded-2xl shadow-md p-4'>
  <div className='h-[400px] w-full'>
  <BarChart/>
  </div>

  <div className='h-[300px] flex w-full gap-8'>
  <LowStockAlert/>
    <Customers/>

  </div>
  {/* <Bar data={data1} options={options} /> */}

</div>


    </div>
  );
}
