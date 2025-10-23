import React from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const ProductCardSeller = ({product, updatePage}) => {

  const handleRemove = async (id) => {
    try{
      await api.delete('/seller/deleteProduct/', { data : {id} });
      toast.success("Item removed");
      updatePage();
    }catch(err){
      console.error(err);
      toast.error("Unable to perform operation");
    }
  }


  return (
    <div className="flex flex-row justify-between items-center border rounded-lg shadow p-4 hover:shadow-lg transition">
      <div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">Price: ₹{product.price}</p>
        <p className="text-sm text-gray-500">In Stock: {product.count}</p>
      </div>
      <div className='flex flex-col gap-2 items-center'>
        <Link to = '/editProduct' state={{product}} className='bg-yellow-500 w-20 text-white text-center rounded-lg hover:bg-yellow-600'>Edit</Link>
        <button onClick={() => handleRemove(product._id)} className='bg-red-500 w-20 text-white text-center rounded-lg hover:bg-red-600'>Remove</button>
      </div>
  </div>
  )
}

export default ProductCardSeller
