import React, { useState, useEffect } from "react";
import api from "../services/api";
import OrderCards from "../components/OrderCards";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [shouldRefresh]);


  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/userOrders");
      setOrders(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const refreshPage = () => setShouldRefresh(x => !x);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-semibold text-center mb-6 underline">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCards key={order._id} product={order} refresh={refreshPage} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
