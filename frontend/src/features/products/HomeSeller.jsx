import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCardSeller from './ProductCardSeller';
import MenuBox from '../../components/layout/MenuBox';
import Spinner from '../../components/common/Spinner';

const HomeSeller = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try{
            const res = await api.get('/seller/myProducts');
            setProducts(res.data);
        } catch(err){
            console.error(err);
        } finally {
            setLoading(false);
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
        <div className='sticky top-[57px] w-full flex flex-wrap gap-3 justify-between items-center px-6 py-4 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
            <h1 className='font-extrabold text-2xl text-slate-800'>Your Products</h1>
            <div className='flex items-center gap-3'>
                <MenuBox />
                <Link to='/addProduct' className='bg-indigo-600 px-5 py-2 text-center rounded-xl text-white font-semibold shadow-sm hover:bg-indigo-700 active:scale-95 transition'>+ Add product</Link>
            </div>
        </div>
        <div className='max-w-6xl w-full mx-auto p-6'>
            {loading ? (
                <Spinner label="Loading your products..." />
            ) : products.length > 0 ? (
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {products.map((p) => (
                    <ProductCardSeller key={p._id} product={p} updatePage={updatePage} />
                ))}
                </div>
            ) : (
                <p className='text-slate-500 text-xl mt-20 flex justify-center'>No products yet — click "Add product" to get started.</p>
            )
        }
      </div>
    </div>
  )
}

export default HomeSeller
