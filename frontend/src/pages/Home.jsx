import { useEffect, useState } from "react";
import api from '../services/api'
import ProductCard from "../components/ProductCard";
import MenuBox from "../components/MenuBox";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchProducts();
    try {
      const res = await api.get(`/product/search/${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="relative flex items-center w-full">
        <p className="text-3xl underline absolute left-1/2 -translate-x-1/2">Available Products</p>
        <div className="absolute right-10">
          <MenuBox />
        </div>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 my-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p._id} className="flex flex-col">
              <ProductCard product={p} />
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
