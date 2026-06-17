import React from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const ProductCardSeller = ({product, updatePage}) => {

  const removeProduct = async (id) => {
    try{
      await api.delete('/seller/deleteProduct/', { data : {id} });
      toast.success("Item removed");
      updatePage();
    }catch(err){
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to perform operation");
    }
  }

  const handleRemove = (id) => {
    confirmAlert({
      title : 'Remove product',
      message : `Are you sure you want to remove "${product.name}"?`,
      buttons : [
        {label : 'Remove', onClick : () => removeProduct(id)},
        {label : 'Cancel'}
      ]
    });
  }


  return (
    <div className="flex flex-row justify-between items-center bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-lg transition-all duration-200">
      <div className='flex flex-col gap-1'>
        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="text-2xl font-extrabold text-indigo-600">₹{product.price}</p>
        {product.count <= 0 ? (
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full w-fit">Out of stock</span>
        ) : (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">In stock: {product.count}</span>
        )}
      </div>
      <div className='flex flex-col gap-2 items-stretch'>
        <Link to='/editProduct' state={{product}} className='bg-amber-500 px-5 py-1.5 text-white text-sm font-semibold text-center rounded-lg hover:bg-amber-600 active:scale-95 transition'>Edit</Link>
        <button onClick={() => handleRemove(product._id)} className='bg-rose-500 px-5 py-1.5 text-white text-sm font-semibold text-center rounded-lg hover:bg-rose-600 active:scale-95 transition'>Remove</button>
      </div>
  </div>
  )
}

export default ProductCardSeller
