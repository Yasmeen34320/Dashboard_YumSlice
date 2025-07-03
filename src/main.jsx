import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
 import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Context/auth_context.jsx'
import ProductsManagement from './Components/products/product_managment.jsx'
import CustomersManagement from './Components/users/customers_mangment.jsx'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <AuthProvider> {/* ✅ Wrap here */}
        <CustomersManagement />
      </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
