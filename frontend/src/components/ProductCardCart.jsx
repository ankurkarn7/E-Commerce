import { useState } from "react";
import api from "../services/api";
import {toast} from 'react-toastify'

const ProductCardCart = ({ product, updateCart }) => {

  const addToCart = async (productId, count) => {
    try{
      await api.post('/cart/add', {productId, count});
      updateCart();
    }catch(err){
      console.error(err);
      toast.error("Unable to perform operation");
    }
  }

  const handleRemove = async(productId) => {
    try{
      await api.delete('/cart/remove', {data : {productId}});
      toast.success("Item removed");
      updateCart();
    }catch(err){
      console.error(err);
      toast.error("Unable to perform operation");
    }
  }

  const handleOrder = async(productId) => {
    try{
      await api.post('/order/orderOne', {productId});
      toast.success("Item ordered");
      updateCart();
    }catch(err){
      console.error(err);
      toast.error("Unable to perform operation");
    }
  }

  return(
    <div className="border rounded-lg shadow p-4 hover:shadow-lg transition flex flex-col ">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">Price: ₹{product.price}</p>
          <p className="text-sm text-gray-500">Quantity: {product.count}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row">
            <button className="w-10 h-8 text-2xl flex justify-center items-center bg-blue-500 rounded-md text-white hover:bg-blue-600" onClick={() => addToCart(product._id, 1)}>+</button>
            <button className="w-10 h-8 text-2xl flex justify-center items-center bg-blue-500 rounded-md text-white ml-2 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed" 
            onClick={() => addToCart(product._id, -1)}
            disabled={product.count <= 1}
            >-</button>
          </div>
            <button className="bg-red-500 p2 rounded-lg hover:bg-red-600 text-white" onClick={() => handleRemove(product._id)}>Remove</button>
          </div>
      </div>
      <div className="flex justify-center items-center p-3">
        <button className="bg-yellow-500 w-2/3 text-lg rounded-md hover:bg-yellow-600 text-white" onClick={() => handleOrder(product._id)}>Place Order</button>
      </div>
    </div>
  );
};

export default ProductCardCart;