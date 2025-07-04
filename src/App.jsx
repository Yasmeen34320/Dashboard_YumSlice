import { Routes, Route } from 'react-router-dom'
import DashboardMain from './Components/dashboard_main'
import ReviewsManagement from './Components/reviews_managment'
import CustomersManagement from './Components/customers_mangment'
import OrderManagement from './Components/order_managment'
import ProductManagement from './Components/product_managment'
import LoginPage from './Components/login_page'
import PaymentManagement from './Components/payment_managment'
import Dashboard from './Components/dashboard'
import AdminRoute from './admin_route'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Layout route with nested children */}
           <Route element={<AdminRoute />}>
          <Route path="/" element={<DashboardMain />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<CustomersManagement />} />
            <Route path="reviews" element={<ReviewsManagement />} />
            <Route path="payment" element={<PaymentManagement />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<h1 className="text-black text-center text-2xl">Bad Request or You Are not Allowed</h1>} />
      </Routes>
    </div>
  )
}

export default App
