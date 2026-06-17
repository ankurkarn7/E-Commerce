import { useCallback, useEffect, useState } from "react";
import api from '../../api/axios'
import ProductCard from "./ProductCard";
import MenuBox from "../../components/layout/MenuBox";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartMap, setCartMap] = useState({});   // productId -> count in cart
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (user?.role !== 'user') {
      setCartMap({});
      return;
    }
    try {
      const res = await api.get("/cart/");
      const items = res.data.items || [];
      const map = {};
      items.forEach((item) => { map[item._id] = item.count; });
      setCartMap(map);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product/");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchProducts();
    setLoading(true);
    try {
      const res = await api.get(`/product/search/${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <h1 className="text-3xl font-extrabold text-slate-800">Available Products</h1>
        <MenuBox />
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 my-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-slate-200 bg-white px-4 py-2.5 rounded-xl flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <Spinner label="Loading products..." />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} cartCount={cartMap[p._id] || 0} onCartChange={fetchCart} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 text-lg mt-20">No products found.</p>
      )}
    </div>
  );
};

export default Home;
