import { useState } from 'react'

import './App.css'

import { Route, Routes } from 'react-router-dom'
import DashboardMain from './Components/dashboard_main'
import ReviewsManagement from './Components/reviews_managment'
import CustomersManagement from './Components/customers_mangment'
import OrderManagement from './Components/order_managment'
import ProductManagement from './Components/product_managment'
import LoginPage from './Components/login_page'
import PaymentManagement from './Components/payment_managment'


function App() {
  
  return (
    <div className="flex flex-col min-h-screen  bg-zinc-900">
    {/* <Navbar/> */}
    <Routes>
    <Route exact path="/" element={<DashboardMain />} />
    <Route path='/reviews' element={<ReviewsManagement />} />
    <Route path='/orders' element={<OrderManagement />} />
    <Route path='/users' element={<CustomersManagement />} />
    <Route path='/products' element={<ProductManagement/>}/>
    <Route path='/login' element={<LoginPage />} />
    <Route path = "payment" element ={<PaymentManagement/>}/>
    
    <Route path='*' element={<h1 className='text-white text-2xl'>Page Not Found</h1>} />
    
    </Routes>
    </div>
  )
}

export default App
