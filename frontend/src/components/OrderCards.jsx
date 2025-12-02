import React, { useContext } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const OrderCards = ({ product, refresh }) => {
  const {user} = useContext(AuthContext);

  const acceptOrder = async(OrderId) => {
    try{
      await api.patch('/order/acceptOrder', {_id : OrderId});
      refresh();
      toast.success("Order accepted");
    }catch(err){
      toast.error("Unable to accept order");
    }
  }

  const cancelOrder = async(OrderId) => {
    try{
      await api.patch('/order/cancelOrder', {_id : OrderId});
      refresh();
      toast.success("Order cancelled");
    }catch(err){
      toast.error("Unable to cancel order");
    }
  }


  return (
    <div className='border shadow-md rounded-md flex flex-row justify-between p-5'>
      <div className='flex flex-col'>
        <span><b>Name</b> : {product.items[0].name}</span>
        <span><b>Price</b> : <b>₹</b>{product.items[0].price}</span>
        <span><b>Quantity</b> : {product.items[0].count}</span>
        <span><b>Total Amount</b> : <b>₹</b>{product.totalAmount}</span>
        <span><b>Date</b> : {product.createdAt.split('T')[0]}</span>
      </div>
      <div className='flex flex-col justify-center items-center'>
        {product.status === 'Accepted' ? (
          <span className='bg-green-500 px-2 py-1 rounded-lg text-white'>{product.status}</span>
        ) : product.status === 'Cancelled' ? (
          <span className='bg-red-600 px-2 py-1 rounded-lg text-white'>{product.status}</span>
        ) : user?.role === 'user' ? (
          <div className='flex flex-col items-center gap-4'>
            <span className='bg-yellow-500 px-2 py-1 rounded-lg text-white'>{product.status}</span>
            <button className='bg-orange-200 rounded-md px-2 hover:bg-orange-400' onClick={() => cancelOrder(product._id)}>Cancel</button>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <span className='bg-yellow-500 px-2 py-1 rounded-lg text-white'>{product.status}</span>
            <button className='bg-orange-200 rounded-md px-2 hover:bg-orange-400' onClick={() => acceptOrder(product._id)}>Accept</button>
            <button className='bg-orange-200 rounded-md px-2 hover:bg-orange-400' onClick={() => cancelOrder(product._id)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCards
