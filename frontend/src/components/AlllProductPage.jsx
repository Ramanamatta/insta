import React, { useRef, useEffect, useState } from "react";
import useProductStore from "../just/addProductStore.js";
import useGetAllProducts from "../hooks/useGetAllProducts.jsx";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import RightSidebar from './RightSidebar';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const AddProductPage = () => {
  useGetAllProducts();
  useGetSuggestedUsers();
  const products = useProductStore((state) => state.products);

  const cardRefs = useRef([]); // hold refs to product cards
  const [activeIndex, setActiveIndex] = useState(null); // which product is in view (optional)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [products]);


   const handlePayment = async (product) => {
    try {
      // 1. Create order on your backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/payment/order`,
        { amount: product.price }
      );

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key
        amount: order.amount, // in paise
        currency: order.currency,
        name: "My Shop",
        description: product.name,
        image: product.image,
        order_id: order.id, // Razorpay order id
        handler: async function (response) {
          // 3. Verify payment at backend
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product._id,
              amount: product.price,
            },
            { withCredentials: true }
          );
          if (verifyRes.data.success) {
            toast.success("Order confirmed! Check My Orders page.");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
  };

  return (
    <div className='flex min-h-screen pt-16 lg:pt-0'>
      <div className='flex-1 max-w-full lg:max-w-4xl mx-auto'>
        <div className="min-h-screen bg-gray-50">
          <div className="px-4 lg:px-8 py-4 lg:py-8">
            <h2 className="text-2xl font-bold mb-6 text-center sticky top-16 lg:top-0 bg-gray-50 py-4 z-10">
              Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products?.map((product) => (
                <div
                  key={product?._id}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                >
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product?.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product?.description}</p>
                    <div className="space-y-1 mb-4">
                      <p className="text-xl font-bold text-blue-600">₹{product?.price}</p>
                      <p className="text-xs text-gray-500">Category: {product?.category}</p>
                      <p className="text-xs text-gray-500">Stock: {product?.stock}</p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2" 
                      onClick={() => handlePayment(product)}
                    >
                      <ShoppingCart size={16} />
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RightSidebar/>
    </div>
  );
};

export default AddProductPage;
