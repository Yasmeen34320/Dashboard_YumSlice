import React from 'react'
import {Outlet, Link, useLocation } from 'react-router-dom'
import { MdOutlineDashboard } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { CiUser } from "react-icons/ci";
import { BiCommentDots } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { MdDateRange } from "react-icons/md";

export default function DashboardMain() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Dashboard', to: '/' , icon: <MdOutlineDashboard /> },
    { label: 'Orders', to: '/orders', icon: <IoBagOutline /> },
    { label: 'Products', to: '/products', icon: <LiaBirthdayCakeSolid /> },
    { label: 'Customers', to: '/users', icon: <CiUser /> },
    { label: 'Reviews', to: '/reviews', icon: <BiCommentDots  /> },
    { label: 'Payment', to: '/payment', icon: <MdOutlinePayment  /> },
  ]

  return (
    <div className="w-full flex h-screen">
      {/* Sidebar */}
  <div className="fixed top-0 left-0 h-screen w-[250px] bg-white border-r border-gray-200 z-10">
  {/* Logo section - fixed height */}
  <div className="h-[18%] border-b border-gray-200 p-4 flex items-center">
    <h2 className="text-lg font-semibold text-orange-950 tracking-[.1em]">Logo</h2>
  </div>

  {/* Navigation list - takes remaining height */}
  <div className="flex-1 overflow-y-auto px-4 ">
    <ul className="mt-4 space-y-2">
      {navLinks.map(({ label, to ,icon}) => (
        <li key={to} className="mb-2 w-full border-radius-lg">
          <Link
            to={to}
            className={`py-2 px-4 text-base flex items-center gap-4 tracking-[.1em] rounded-md font-semibold  hover:text-orange-950 hover:bg-orange-50 ${
              isActive(to) ? 'bg-orange-50 text-orange-950 font-semibold' : 'text-gray-700'
            }`}
          >
          {icon}
 {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
{/* <spacer></spacer> */}
<div className='flex h-[13%] mt-20  items-center justify-start border-t border-gray-200 p-4'>
  <div className='bg-orange-950 p-3 rounded-full'>
<p className='text-white tracking-[.1em] font-semibold p-0 m-0'>YA</p>

 </div>
 <div className='flex flex-col ml-4 items-start'>
  <p className='text-gray-700 tracking-[.1em] font-semibold p-0 m-0' style={{fontSize: '0.9rem'}}>Yasmeen Alaa</p>
  <p className='text-gray-500 tracking-[.1em] font-semibold p-0 m-0' style={{fontSize: '0.875rem'}}>Admin</p>
 </div>
  {/* <button className='bg-orange-950 text-white py-2 px-4 rounded-md'>Logout</button> */}
</div>
</div>


      {/* Content area */}
      <div className="ml-[250px] flex-1 overflow-y-auto">
      <div className='flex h-[10%] p-2 px-4 bg-white items-center justify-between border-b border-gray-200 mb-4'>
     {/* Current date display */}
     <div className='flex gap-2 items-center'>
      <p className='font-semibold tracking-[.1em] ' style={{fontSize: '0.875rem'}}>{new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>
<MdDateRange />
      </div>

      </div>
        {/* Actual content will come here via <Routes> in App.jsx */}
<div className='px-4 py-2'>
  <Outlet />
</div>
      </div>
    </div>
  )
}
