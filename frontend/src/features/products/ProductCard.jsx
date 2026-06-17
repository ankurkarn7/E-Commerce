import { toast } from "react-toastify";
import api from "../../api/axios";

const ProductCard = ({ product, cartCount = 0, onCartChange }) => {
  const outOfStock = product.count <= 0;

  const addToCart = async (count) => {
    try {
      const res = await api.post('/cart/add', { productId: product._id, count });
      if (res.data.capped) toast.warning(res.data.message);
      else if (count > 0 && cartCount === 0) toast.success("Successfully added to cart");
      onCartChange?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to add product to cart");
    }
  };

  const removeFromCart = async () => {
    try {
      await api.delete('/cart/remove', { data: { productId: product._id } });
      onCartChange?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to update cart");
    }
  };

  // Stepper "-" at qty 1 removes the item entirely; otherwise decrement.
  const decrement = () => (cartCount <= 1 ? removeFromCart() : addToCart(-1));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="text-2xl font-extrabold text-indigo-600">₹{product.price}</p>
        {outOfStock ? (
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full w-fit">Out of stock</span>
        ) : (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">{product.count} in stock</span>
        )}
      </div>
      <div>
        {cartCount > 0 ? (
          <div className="flex flex-row items-center gap-2 bg-slate-50 rounded-lg p-1">
            <button
              className="w-9 h-9 text-xl flex justify-center items-center bg-white shadow-sm rounded-md text-indigo-600 font-bold hover:bg-indigo-50 transition"
              onClick={decrement}
              aria-label="Decrease quantity"
            >−</button>
            <span className="w-7 text-center font-semibold text-slate-700">{cartCount}</span>
            <button
              className="w-9 h-9 text-xl flex justify-center items-center bg-white shadow-sm rounded-md text-indigo-600 font-bold hover:bg-indigo-50 disabled:text-slate-300 disabled:cursor-not-allowed transition"
              onClick={() => addToCart(1)}
              disabled={cartCount >= product.count}
              aria-label="Increase quantity"
            >+</button>
          </div>
        ) : (
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-4 py-2 shadow-sm active:scale-95 transition disabled:bg-slate-300 disabled:cursor-not-allowed disabled:active:scale-100"
            onClick={() => addToCart(1)}
            disabled={outOfStock}
          >
            {outOfStock ? "Unavailable" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
