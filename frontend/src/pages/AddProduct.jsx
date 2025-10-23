import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

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
        }
    }

  return (
    <div className='flex justify-center items-center flex-col'>
        <p className='text-3xl text-center font-bold mt-10'>Add Product</p>
        <form onSubmit={handleSubmit} className='min-w-96 bg-gray-100 flex flex-col justify-center items-center mt-10 rounded-lg p-6 gap-5'>
            <div className='flex flex-row items-center justify-between'>
                <p className='font-bold w-24'>Name: </p>
                <input className='w-64 px-3 py-2 border rounded'
                    type='text'
                    value={name}
                    placeholder='product name'
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className='flex flex-row items-center justify-between'>
                <p className='font-bold w-24'>Price:</p>
                <input className='w-64 px-3 py-2 border rounded'
                    type='number'
                    value={price}
                    placeholder='price'
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                />
            </div>
            <div className='flex flex-row items-center justify-center'>
                <p className='font-bold w-24'>Quantity:</p>
                <input className='w-64 px-3 py-2 border rounded'
                    type='number'
                    value={count}
                    placeholder='quantity'
                    onChange={(e) => setCount(Number(e.target.value))}
                    required
                />
            </div>
            <button type='submit' className='bg-blue-500 w-80 rounded-lg py-2 text-white'>Add Product</button>
        </form>
    </div>
  )
}

export default AddProduct
