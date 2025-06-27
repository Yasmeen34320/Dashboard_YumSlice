import React from 'react'
import { FaLongArrowAltUp } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { PiHandbagFill } from "react-icons/pi";
import { RiCake2Line } from "react-icons/ri";
import { useQuery } from '@tanstack/react-query';
import { fetchDeliveredOrders, fetchReviews } from '../services/dashboardService';
import { FaLongArrowAltDown } from "react-icons/fa";
import MonthlyRevenueChart from './sharedComponents/monthly_revenue_chart';
import OrderStatusPieChart from './sharedComponents/order_status_chart';
import RecentOrdersTable from './sharedComponents/recent_orders_table';
import LatestReviews from './sharedComponents/latest_review';

export default function Dashboard() {
     const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchDeliveredOrders
  });

const {data: reviews, isLoading: isLoading1, isError: isError1}=useQuery({
queryKey:['reviews'],
queryFn:fetchReviews
});
  if (isLoading || isLoading1) return <p>Loading...</p>;
  if (isError || isError1) return <p>Error loading dashboard data</p>;

//   const { totalRevenue, revenueGrowth, ordersToday, ordersGrowth, topCake, topCakeOrders } = data;
// const totalRevenue = data.reduce((sum,d)=>sum+d.totalPrice,0); // Example value
  const {deliveredOrders,totalOrders,orderStatusData,monthlyRevenue,topSellingProduct,totalRevenue ,todayCount, percentageChange , allOrders}=data;

  return (
    <div className='w-full h-full flex justify-center flex-col '>
      <h1 className='text-xl font-semibold tracking-[.1em]'>Dashboard</h1>
      <p className='text-gray-600 font-semibold  tracking-[.05em] text-sm'>Welcome back, James! Here's what's happening with your cake store today.
</p>

<div className='w-full tracking-[.1em]  flex flex-col md:flex-row justify-center gap-2items-center mt-4 '>
<div className=' w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg  m-2' style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
<div className='flex justify-between items-center'>

<div className='p-4 flex flex-col gap-2'>
    <h2 className='text-gray-500 font-semibold ' style={{fontSize: '0.875rem'}}>Total Revenues</h2>
    <p className='font-semibold text-xl'>${totalRevenue}</p>
</div>

<div className='p-4 rounded-full bg-orange-50 mr-10 flex items-center justify-center' style={{width: '50px', height: '50px'}}>
<LuCircleDollarSign className='text-orange-950' />

</div>
</div>
<div className="flex-1"></div>

<div className='flex justify-between px-4 py-4'>
        <div className='flex gap-1 items-center'>
       {percentageChange>0 ? <FaLongArrowAltUp className='text-green-500' /> : <FaLongArrowAltDown className='text-red-500' />}
        <p className={`font-semibold ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{percentageChange>0?percentageChange:percentageChange*-1}%</p>
</div>
    <p className='text-gray-500' style={{fontSize: '0.875rem'}}>vs last month</p>
</div>
</div>
<div className='w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg  m-2' style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
<div className='flex justify-between items-center'>
<div className='p-4 flex flex-col gap-2'>
    <h2 className='text-gray-500 font-semibold ' style={{fontSize: '0.875rem'}}>Orders Today</h2>
    <p className='font-semibold text-xl'>{todayCount}</p>
</div>
<div className='p-4 rounded-full bg-green-50 mr-10 flex items-center justify-center' style={{width: '50px', height: '50px'}}>
<PiHandbagFill className='text-green-500' />

</div>
</div>
  <div className="flex-1"></div>

<div className='flex justify-between px-4 pb-4'>
    <div className='flex gap-1 items-center'>{percentageChange>0 ? <FaLongArrowAltUp className='text-green-500' /> : <FaLongArrowAltDown className='text-red-500' />}
        <p className={`font-semibold ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{percentageChange}%</p>
</div>
    <p className='text-gray-500' style={{fontSize: '0.875rem'}}>vs Yesterday</p>
</div>
</div>
<div className='w-full md:w-1/3 h-40 flex flex-col bg-white rounded-lg  m-2' style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
<div className='flex justify-between items-center'>
<div className='p-4 flex flex-col gap-2'>
    <h2 className='text-gray-500 font-semibold ' style={{fontSize: '0.875rem'}}>Top Selling Product</h2>
    <p className='font-semibold text-lg'>{topSellingProduct.productName}</p>
</div>
<div className='p-4 rounded-full bg-purple-50 mr-10 flex items-center justify-center' style={{width: '50px', height: '50px'}}>
<RiCake2Line className='text-purple-950' />
</div>
</div>
<div className="flex-1"></div>

<div className='flex justify-between px-4 pb-4'>
  
    <p className='text-gray-500' style={{fontSize: '0.875rem'}}>{topSellingProduct.quantitySold} orders this month</p>
</div>
</div>
</div>
<div className='flex  md:gap-8 flex-col md:flex-row justify-between'>
    <MonthlyRevenueChart data={monthlyRevenue} />
<OrderStatusPieChart data={orderStatusData} totalOrders={totalOrders} avgOrderValue={totalRevenue/totalOrders}/>
</div>
<div className='flex gap-2 w-full flex-col md:flex-row'>
<RecentOrdersTable  orders={allOrders.slice(0,4)}/>
<LatestReviews data={reviews}/>
</div>
    </div>
  )
}
