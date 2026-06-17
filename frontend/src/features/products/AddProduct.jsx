import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const AddProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [count, setCount] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.post('/seller/addProduct', {name, price, count});
            toast.success("Product added");
            setTimeout(() => { navigate('/') }, 500);
        }catch(err){
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to add product");
        }
    }

  return (
    <div className='flex justify-center items-center flex-col px-4'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white flex flex-col mt-16 rounded-2xl shadow-xl border border-slate-100 p-8 gap-5'>
            <p className='text-3xl text-center font-extrabold text-slate-800'>Add Product</p>
            <div className='flex flex-col gap-1.5'>
                <label className='font-semibold text-slate-700 text-sm'>Name</label>
                <input className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    type='text'
                    value={name}
                    placeholder='Product name'
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label className='font-semibold text-slate-700 text-sm'>Price (₹)</label>
                <input className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    type='number'
                    min='0'
                    value={price}
                    placeholder='Price'
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label className='font-semibold text-slate-700 text-sm'>Quantity</label>
                <input className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    type='number'
                    min='0'
                    value={count}
                    placeholder='Quantity'
                    onChange={(e) => setCount(Number(e.target.value))}
                    required
                />
            </div>
            <button type='submit' className='bg-indigo-600 w-full rounded-xl py-2.5 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition shadow-sm'>Add Product</button>
        </form>
    </div>
  )
}

export default AddProduct
