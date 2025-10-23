import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext'

const Navbar = () => {

  const navigate = useNavigate();
  const {user, logout} = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className='flex flex-row items-center justify-center gap-5'>
        <h1 className="text-xl font-bold">Market Place</h1>
        {user?.role === 'seller' && <p className='text-xl bg-yellow-600 px-3 rounded'>Seller</p>}
      </div>
      <div className="space-x-4">
        <Link to = '/' className='transition-transform inline-block hover:scale-125'>
          Home
        </Link>
        {user ? (
          <>
            {user.role === 'user' && (
              <Link to = '/cart' className='transition-transform inline-block hover:scale-125'>
                Cart
              </Link>
            )}
            <button onClick={handleLogout} className='bg-red-500 px-2 rounded-md hover:bg-red-800'> Logout </button>
          </>
        ) : (
          <>
            <Link to = '/login' className='transition-transform inline-block hover:scale-125'>
              Login
            </Link>
            <Link to = '/signup' className='transition-transform inline-block hover:scale-125'>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;