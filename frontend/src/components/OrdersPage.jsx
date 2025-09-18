import React from "react";
import useGetOrders from "../hooks/useGetOrders.jsx";
import useOrderStore from "../just/orderStore.js";

const OrdersPage = () => {
  useGetOrders();
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="ml-[16%] p-8 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold mb-6 flex justify-center sticky top-0 bg-white z-10">
        My Orders
      </h2>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4">
            <img
              src={order.product?.image}
              alt={order.product?.name}
              className="h-20 w-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{order.product?.name}</h3>
              <p className="text-sm text-gray-600">{order.product?.description}</p>
              <p className="text-blue-600 font-semibold">₹{order.totalAmount}</p>
              <p className="text-xs text-gray-400">Quantity: {order.quantity}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {orders?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;