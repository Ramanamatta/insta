import React, { useRef, useEffect, useState } from "react";
import useProductStore from "../just/addProductStore.js";
import useGetAllProducts from "../hooks/useGetAllProducts.jsx";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AddProductPage = () => {
  useGetAllProducts();
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
    <div className="ml-[16%] p-8 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold mb-6 flex justify-center sticky top-0 bg-white z-10">
        Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products?.map((product) => (
          <div
            key={product?._id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center"
          >
            <img
              src={product?.image}
              alt={product?.name}
              className="h-48 w-full object-cover rounded-md"
            />
            <h3 className="text-lg font-bold mt-2">{product?.name}</h3>
            <p className="text-sm text-gray-600">{product?.description}</p>
            <p className="text-blue-600 font-semibold mt-1">₹{product?.price}</p>
            <p className="text-xs text-gray-400">Category: {product?.category}</p>
            <p className="text-xs text-gray-400">Stock: {product?.stock}</p>
            <Button className="mt-3 bg-[#0095F6] hover:bg-[#258bcf] w-full flex items-center justify-center gap-2 text-sm py-2 cursor-pointer" 
              onClick={() => handlePayment(product)}
            >
            
              
              Pay
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProductPage;
