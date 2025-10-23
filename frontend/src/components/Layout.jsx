import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({children}) => {
  return (
    <div className='flex flex-col h-screen'>
        <Navbar />
        <main className='flex-1 bg-pink-100'>
          <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout
