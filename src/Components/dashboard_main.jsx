import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  MdOutlineDashboard, MdOutlinePayment, MdDateRange, MdMenu,MdLocalOffer 
} from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { CiUser } from "react-icons/ci";
import { BiCommentDots } from "react-icons/bi";
import { useAuth } from '../Context/auth_context';

export default function DashboardMain() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', to: '/', icon: <MdOutlineDashboard /> },
    { label: 'Orders', to: '/orders', icon: <IoBagOutline /> },
    { label: 'Products', to: '/products', icon: <LiaBirthdayCakeSolid /> },
    { label: 'Customers', to: '/users', icon: <CiUser /> },
    { label: 'Reviews', to: '/reviews', icon: <BiCommentDots /> },
    { label: 'Payment', to: '/payment', icon: <MdOutlinePayment /> },
    { label: 'Promocodes', to: '/promoCodes', icon: <MdLocalOffer  /> },
  ];
const { authUser, role, loading ,logout} = useAuth();
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0].toUpperCase() || '';
  const second = parts[1]?.[0].toUpperCase() || '';
  return first + second;
};
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirect to login
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-[270px] bg-white border-r border-gray-200 flex-col justify-between">
        <div className="p-4 border-b border-gray-200 h-[70px] flex items-center">
          <h2 className="text-lg font-semibold text-orange-950 tracking-[.1em]">Logo</h2>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-2 mt-4">
            {navLinks.map(({ label, to, icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`py-2 px-4 text-sm flex items-center gap-4 tracking-[.1em] rounded-md font-semibold hover:text-orange-950 hover:bg-orange-50 ${
                    isActive(to) ? 'bg-orange-50 text-orange-950' : 'text-gray-700'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-4 flex items-center">
         <div className="bg-orange-950 px-3 py-2 rounded-full text-center flex items-center justify-center">
  <p className="text-white font-semibold">
    {authUser.email[0].toUpperCase()}
  </p>
</div>

          <div className="flex flex-col ml-4 items-start">
            <p className="text-gray-700 tracking-[.1em] font-semibold text-sm">{authUser.email}</p>
            <p className="text-gray-500 tracking-[.1em] font-semibold text-sm">Admin</p>
          </div>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <header className=" md:hidden block  fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-20 px-4 py-3  ">
        <div className='flex justify-between items-center'>
        <h2 className="text-lg font-semibold text-orange-950">Logo</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-orange-950 text-2xl">
          <MdMenu />
        </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
  <div className="fixed top-[56px] left-0 right-0 bg-white border-b border-gray-200 z-10 shadow-md md:hidden">

          <ul className="px-4 py-2 space-y-2">
            {navLinks.map(({ label, to, icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 px-4 flex text-sm items-center gap-3 rounded-md font-medium ${
                    isActive(to) ? 'bg-orange-50 text-orange-950' : 'text-gray-700'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 mt-[56px] md:mt-0  overflow-y-auto">
        <div className="flex h-[70px] p-4 bg-white items-center justify-between border-b border-gray-200 mb-4">
          <div className="flex gap-2 items-center">
            <p className="font-semibold tracking-[.1em] text-sm">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <MdDateRange />
          </div>
          <button onClick={handleLogout} className='p-2 px-4 bg-orange-950 text-white tracking-[.1em] cursor-pointer hover:bg-amber-900 rounded-lg'>LogOut</button>
        </div>
        <div className="px-4 py-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
