import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCardSeller from '../components/ProductCardSeller';

const HomeSeller = () => {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try{
            const res = await api.get('/seller/myProducts');
            setProducts(res.data);
        } catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
      fetchProducts();
    }, [])

    const updatePage = () => {
        fetchProducts();
    }
    

  return (
    <div className='flex flex-col'>
        <div className='sticky top-0 w-full flex justify-center items-center p-5 z-10 bg-pink-100 shadow'>
            <h1 className='font-bold text-2xl underline'>Your Products</h1>
            <Link to='/addProduct' className='absolute right-5 bg-blue-500 w-32 text-center rounded-lg text-white p-1 hover:bg-blue-600' >Add product</Link>
        </div>
        <div className='m-8'>
            {products.length > 0 ? (
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {products.map((p) => (
                    <ProductCardSeller key={p._id} product={p} updatePage={updatePage} />
                ))}
                </div>
            ) : (
                <p className='text-blue-500 text-2xl mt-20 flex justify-center'>Click add items to add your items</p>
            )
        }
      </div>
    </div>
  )
}

export default HomeSeller
