import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import NotFound from './components/common/NotFound';
import HomeWrapper from './features/products/HomeWrapper';
import AddProduct from './features/products/AddProduct';
import EditProduct from './features/products/EditProduct';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Cart from './features/cart/Cart';
import UserOrders from './features/orders/UserOrders';
import SellerOrders from './features/orders/SellerOrders';
import PendingSellerOrders from './features/orders/PendingSellerOrders';
import AcceptedSellerOrders from './features/orders/AcceptedSellerOrders';
import CancelledSellerOrders from './features/orders/CancelledSellerOrders';

const router = createBrowserRouter([
  {
    element : <Layout />,
    children : [
      {path: '/', element: <HomeWrapper />},
      {path: '/login', element: <Login />},
      {path: '/signup', element: <Signup />},
      {path: '/cart', element: <Cart />},
      {path: '/addProduct', element: <AddProduct />},
      {path: '/editProduct', element: <EditProduct />},
      {path: '/userOrders', element: <UserOrders />},
      {path: '/orders', element: <SellerOrders/>},
      {path: '/pendingOrders', element: <PendingSellerOrders />},
      {path: '/acceptedOrders', element: <AcceptedSellerOrders />},
      {path: '/cancelledOrders', element: <CancelledSellerOrders />},
      {path: '*', element: <NotFound />},
    ]
  }
])


function App() {
  
  return(
    <>
      <RouterProvider router={router} />
      <ToastContainer position='top-center' autoClose={1000} />
    </>
  );
}

export default App