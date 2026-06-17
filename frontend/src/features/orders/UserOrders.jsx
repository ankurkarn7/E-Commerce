import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import OrderCard from "./OrderCard";
import Spinner from "../../components/common/Spinner";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/order/userOrders");
      setOrders(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [shouldRefresh, fetchOrders]);

  const refreshPage = () => setShouldRefresh(x => !x);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-8 mt-4">
        My Orders
      </h2>

      {loading ? (
        <Spinner label="Loading your orders..." />
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-500 text-lg mt-16">No orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard key={order._id} product={order} refresh={refreshPage} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
