import api from "../../api/axios";
import {toast} from 'react-toastify'

const ProductCardCart = ({ product, updateCart }) => {

  const addToCart = async (productId, count) => {
    try{
      const res = await api.post('/cart/add', {productId, count});
      if(res.data.capped) toast.warning(res.data.message);
      updateCart();
    }catch(err){
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to perform operation");
    }
  }

  const handleRemove = async(productId) => {
    try{
      await api.delete('/cart/remove', {data : {productId}});
      toast.success("Item removed");
      updateCart();
    }catch(err){
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to perform operation");
    }
  }

  const handleOrder = async(productId) => {
    try{
      await api.post('/order/orderOne', {productId});
      toast.success("Item ordered");
      updateCart();
    }catch(err){
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to perform operation");
    }
  }

  return(
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-lg transition-all duration-200 flex flex-col gap-3">
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
          <p className="text-xl font-extrabold text-indigo-600">₹{product.price}</p>
          <p className="text-sm text-slate-500">Subtotal: ₹{product.price * product.count}</p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex flex-row items-center gap-2 bg-slate-50 rounded-lg p-1">
            <button className="w-9 h-9 text-xl flex justify-center items-center bg-white shadow-sm rounded-md text-indigo-600 font-bold hover:bg-indigo-50 disabled:text-slate-300 disabled:cursor-not-allowed transition"
            onClick={() => addToCart(product._id, -1)}
            disabled={product.count <= 1}
            >−</button>
            <span className="w-8 text-center font-semibold text-slate-700">{product.count}</span>
            <button className="w-9 h-9 text-xl flex justify-center items-center bg-white shadow-sm rounded-md text-indigo-600 font-bold hover:bg-indigo-50 transition" onClick={() => addToCart(product._id, 1)}>+</button>
          </div>
          <button className="bg-rose-50 text-rose-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-rose-100 transition" onClick={() => handleRemove(product._id)}>Remove</button>
        </div>
      </div>
      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full py-2.5 text-base font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] text-white shadow-sm transition" onClick={() => handleOrder(product._id)}>Place Order</button>
    </div>
  );
};

export default ProductCardCart;