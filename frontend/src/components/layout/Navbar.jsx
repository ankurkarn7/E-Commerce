import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext'

const Navbar = () => {

  const navigate = useNavigate();
  const {user, logout} = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-y-2">
      <div className='flex flex-row items-center gap-2 sm:gap-3'>
        <Link to='/' className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          Market Place
        </Link>
        {user?.role === 'seller' && <span className='text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full'>Seller</span>}
      </div>
      <div className="flex items-center gap-1 sm:gap-4 text-sm sm:text-base text-slate-700 font-medium">
        <Link to='/' className='px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors'>
          Home
        </Link>
        {user ? (
          <>
            {user.role === 'user' && (
              <Link to='/cart' className='px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors'>
                Cart
              </Link>
            )}
            <button onClick={handleLogout} className='bg-rose-500 text-white px-3 sm:px-4 py-1.5 rounded-lg font-semibold shadow-sm hover:bg-rose-600 active:scale-95 transition'>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors'>
              Login
            </Link>
            <Link to='/signup' className='bg-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 active:scale-95 transition'>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;