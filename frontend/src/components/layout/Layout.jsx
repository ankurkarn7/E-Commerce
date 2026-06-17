import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'>
        <Navbar />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout
