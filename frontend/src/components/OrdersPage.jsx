import React from "react";
import useGetOrders from "../hooks/useGetOrders.jsx";
import useOrderStore from "../just/orderStore.js";

const OrdersPage = () => {
  useGetOrders();
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="min-h-screen pt-16 lg:pt-0 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <h2 className="text-2xl font-bold mb-6 text-center sticky top-16 lg:top-0 bg-gray-50 py-4 z-10">
          My Orders
        </h2>
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={order.product?.image}
                  alt={order.product?.name}
                  className="h-16 w-16 lg:h-20 lg:w-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">{order.product?.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.product?.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <p className="text-blue-600 font-semibold">₹{order.totalAmount}</p>
                    <p className="text-gray-500">Qty: {order.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {orders?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">When you place orders, they'll appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;