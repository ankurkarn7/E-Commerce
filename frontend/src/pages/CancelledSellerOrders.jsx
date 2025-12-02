import React, { useContext, useEffect, useState } from 'react'
import { Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OrderCards from '../components/OrderCards';
import MenuBox from '../components/MenuBox';
import { AuthContext } from '../context/AuthContext';

const CancelledSellerOrders = () => {
  const [products, setProducts] = useState([]);
  const {user} = useContext(AuthContext);

  const fetchProducts = async () => {
    try{
      const url = 
        user?.role === 'user'
        ? "/order/userCancelledOrders"
        : "/order/sellerCancelledOrders";
      const res = await api.get(url);
      setProducts(res.data);
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    if(user == null) return;
    fetchProducts();
  }, [user])

  return (
    <div>
      <div className='sticky top-0 w-full flex justify-center items-center p-5 z-10 bg-pink-100 shadow'>
            <h1 className='font-bold text-2xl underline'>Pending Orders</h1>
            <div className='absolute right-20'>
                <MenuBox />
            </div>
        </div>
         <div className='m-8'>
            {products.length > 0 ? (
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {products.map((p) => (
                    <OrderCards key={p._id} product={p} />
                ))}
                </div>
            ) : (
                <p className='text-blue-500 text-2xl mt-20 flex justify-center'>No item present</p>
            )
        }
      </div>
        
    </div>
  )
}

export default CancelledSellerOrders
