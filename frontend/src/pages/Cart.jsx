import React, { useEffect, useState } from 'react'
import api from '../services/api';
import ProductCardCart from '../components/ProductCardCart';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';         // for asking for confirmation before deleting something
import 'react-confirm-alert/src/react-confirm-alert.css';


const Cart = () => {

    const [products, setProducts] = useState([]);
    const [seller, isSeller] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [])

    const fetchProducts = async() => {
        try{
            const res = await api.get('/cart/');
            if(res.data.message) setProducts([]);           // because backend is sending message that cart is empty
            else setProducts(res.data.items);
            fetchTotal();
            if(res.data.removedItems) toast.warning(`${res.data.removedItems} items were removed because they are no longer available`, {
                autoClose: 2000,            // for setting custom timeout only for this toast
            });
        } catch(err){
            console.error(err);
            isSeller(true);
        }
    }

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
                toast.error("Unable to perform operation");
            }
        })
    };

    const fetchTotal = async () => {        // call it everytime when products are fetched
        try{
            const res = await api.get('/cart/total');
            setTotal(res.data.total);
        }catch(err){
            console.error(err);
        }
    }


    if(seller) return <p className='text-xl text-red-600 mt-20 flex justify-center'>Page available only for customers</p>


  return (
    <div>
        <div className='sticky top-0 left-0 flex justify-center items-center w-full py-4 z-10 shadow'>
            <h1 className='text-3xl font-semibold underline'>Cart</h1>
            {products.length > 0 && <button className='absolute right-5 px-2 bg-red-500 rounded-lg text-white hover:bg-red-600' onClick={emptyCart}>
                Clear all
            </button>}
        </div>
        { products.length > 0 ? (
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 m-6'>
                {products.map((p) => (
                    <ProductCardCart key={p._id} product={p} updateCart={updateCart} />
                ))}
            </div>
        ) : (
            <p className='text-2xl text-red-500 mt-20 w-full text-center'>Your cart is empty.</p>
        )}
        <div className='absolute right-10'>
            <p className='bg-green-700 text-white px-3 py-1 rounded-lg font-semibold'>Total: ₹{total}</p>
        </div>
    </div>
  )
}

export default Cart
