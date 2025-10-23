import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomeWrapper from './components/HomeWrapper';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

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