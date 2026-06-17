import React, { useContext } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthContext } from '../../context/AuthContext';

const OrderCard = ({ product, refresh }) => {
  const {user} = useContext(AuthContext);

  const acceptOrder = async(OrderId) => {
    try{
      await api.patch('/order/acceptOrder', {_id : OrderId});
      refresh();
      toast.success("Order accepted");
    }catch(err){
      toast.error(err.response?.data?.message || "Unable to accept order");
    }
  }

  const cancelOrder = async(OrderId) => {
    try{
      await api.patch('/order/cancelOrder', {_id : OrderId});
      refresh();
      toast.success("Order cancelled");
    }catch(err){
      toast.error(err.response?.data?.message || "Unable to cancel order");
    }
  }

  const deliverOrder = async(OrderId) => {
    try{
      await api.patch('/order/deliverOrder', {_id : OrderId});
      refresh();
      toast.success("Order marked as delivered");
    }catch(err){
      toast.error(err.response?.data?.message || "Unable to update order");
    }
  }

  const handleCancel = (OrderId) => {
    confirmAlert({
      title : 'Cancel order',
      message : `Are you sure you want to cancel the order for "${product.items[0].name}"?`,
      buttons : [
        {label : 'Yes, cancel', onClick : () => cancelOrder(OrderId)},
        {label : 'No'}
      ]
    });
  }


  const statusStyles = {
    Accepted : 'bg-emerald-100 text-emerald-700',
    Delivered : 'bg-indigo-100 text-indigo-700',
    Cancelled : 'bg-rose-100 text-rose-700',
    Pending : 'bg-amber-100 text-amber-700',
  };

  return (
    <div className='bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-row justify-between items-center p-5 hover:shadow-lg transition-all duration-200'>
      <div className='flex flex-col gap-1.5 text-sm text-slate-600'>
        <h3 className='text-lg font-bold text-slate-800'>{product.items[0].name}</h3>
        <span>Price: <span className='font-semibold text-slate-800'>₹{product.items[0].price}</span></span>
        <span>Quantity: <span className='font-semibold text-slate-800'>{product.items[0].count}</span></span>
        <span>Total: <span className='font-extrabold text-indigo-600'>₹{product.totalAmount}</span></span>
        <span className='text-xs text-slate-400'>{product.createdAt.split('T')[0]}</span>
      </div>
      <div className='flex flex-col justify-center items-end gap-3'>
        <span className={`${statusStyles[product.status] || 'bg-slate-100 text-slate-700'} text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full`}>{product.status}</span>
        {product.status === 'Pending' && (
          <div className='flex flex-col items-stretch gap-2'>
            {user?.role !== 'user' && (
              <button className='bg-emerald-500 text-white text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-emerald-600 active:scale-95 transition' onClick={() => acceptOrder(product._id)}>Accept</button>
            )}
            <button className='bg-rose-50 text-rose-600 text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-rose-100 active:scale-95 transition' onClick={() => handleCancel(product._id)}>Cancel</button>
          </div>
        )}
        {product.status === 'Accepted' && user?.role !== 'user' && (
          <button className='bg-indigo-600 text-white text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-indigo-700 active:scale-95 transition' onClick={() => deliverOrder(product._id)}>Mark delivered</button>
        )}
      </div>
    </div>
  )
}

export default OrderCard
