import React, { useContext, useCallback, useEffect, useState } from 'react'
import api from '../../api/axios';
import OrderCard from './OrderCard';
import MenuBox from '../../components/layout/MenuBox';
import Spinner from '../../components/common/Spinner';
import { AuthContext } from '../../context/AuthContext';

const SellerOrders = () => {
  const [products, setProducts] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try{
      const url =
        user?.role === 'user'
        ? "/order/userOrders"
        : "/order/sellerOrders";
      const res = await api.get(url);
      setProducts(res.data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }, [user])

  const refreshPage = () => setShouldRefresh(x => !x);

  useEffect(() => {
    if(user == null){
      return;
    }
    fetchProducts();
  }, [user, shouldRefresh, fetchProducts])

  return (
    <div>
      <div className='sticky top-[57px] w-full flex flex-wrap gap-3 justify-between items-center px-6 py-4 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
            <h1 className='font-extrabold text-2xl text-slate-800'>All Orders</h1>
            <MenuBox />
        </div>
         <div className='max-w-6xl mx-auto p-6'>
            {loading ? (
                <Spinner label="Loading orders..." />
            ) : products.length > 0 ? (
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {products.map((p) => (
                    <OrderCard key={p._id} product={p} refresh={refreshPage} />
                ))}
                </div>
            ) : (
                <p className='text-slate-500 text-xl mt-20 flex justify-center'>No orders yet.</p>
            )
        }
      </div>

    </div>
  )
}

export default SellerOrders
