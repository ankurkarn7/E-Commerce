import React, { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../api/axios';
import ProductCardCart from './ProductCardCart';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';         // for asking for confirmation before deleting something
import 'react-confirm-alert/src/react-confirm-alert.css';


const Cart = () => {

    const [products, setProducts] = useState([]);
    const [seller, isSeller] = useState(false);
    const [loading, setLoading] = useState(true);

    // total is derived from the items we already have — no extra API call needed
    const total = useMemo(
        () => products.reduce((sum, item) => sum + item.price * item.count, 0),
        [products]
    );

    const fetchProducts = useCallback(async() => {
        setLoading(true);
        try{
            const res = await api.get('/cart/');
            if(res.data.message) setProducts([]);           // because backend is sending message that cart is empty
            else setProducts(res.data.items);
            if(res.data.removedItems) toast.warning(`${res.data.removedItems} items were removed because they are no longer available`, {
                autoClose: 2000,            // for setting custom timeout only for this toast
            });
        } catch(err){
            console.error(err);
            isSeller(true);
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts])

    const updateCart = () => {
        fetchProducts();
    }

    const confirm = async (message, onConfirm) => {
        confirmAlert({
            message,
            buttons : [
                {label : 'Confirm', onClick: onConfirm},
                {label : 'Cancel'}
            ]
        });
    };

    const emptyCart = async () => {
        confirm('Are you sure to remove all items?', async () => {
            try{
                await api.delete('/cart/clearAll');
                fetchProducts();
                toast.success("All items removed");
            } catch(err){
                console.error(err);
                toast.error(err.response?.data?.message || "Unable to perform operation");
            }
        })
    };


    if(seller) return <p className='text-xl text-rose-600 mt-20 flex justify-center'>Page available only for customers</p>


  return (
    <div className='pb-24'>
        <div className='sticky top-[57px] left-0 flex flex-wrap gap-3 justify-between items-center w-full px-6 py-4 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
            <h1 className='text-2xl font-extrabold text-slate-800'>Your Cart</h1>
            {products.length > 0 && <button className='px-4 py-2 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 active:scale-95 transition' onClick={emptyCart}>
                Clear all
            </button>}
        </div>
        { loading ? (
            <Spinner label="Loading your cart..." />
        ) : products.length > 0 ? (
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6'>
                {products.map((p) => (
                    <ProductCardCart key={p._id} product={p} updateCart={updateCart} />
                ))}
            </div>
        ) : (
            <p className='text-xl text-slate-500 mt-20 w-full text-center'>Your cart is empty.</p>
        )}
        {products.length > 0 && (
          <div className='fixed bottom-6 right-6 z-20'>
              <p className='bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg'>Total: ₹{total}</p>
          </div>
        )}
    </div>
  )
}

export default Cart
