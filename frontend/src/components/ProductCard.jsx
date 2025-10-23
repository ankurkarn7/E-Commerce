import { toast } from "react-toastify";
import api from "../services/api";

const addToCart = async (productId, count = 1) => {
  try{
    await api.post('/cart/add', {productId, count});
    toast.success("Successfully added to cart");
  }catch(err){
    console.error(err);
    toast.error("Unable to add product to cart");
  }
}


const ProductCard = ({ product }) => (
  <div className="border rounded-lg shadow p-4 hover:shadow-lg transition flex flex-row justify-between items-center">
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">Price: ₹{product.price}</p>
      <p className="text-sm text-gray-500">Quantity: {product.count}</p>
    </div>
    <div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3" onClick={() => addToCart(product._id, 1)}>
        Add to cart
      </button>
    </div>
  </div>
);

export default ProductCard;
