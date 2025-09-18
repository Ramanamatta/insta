import React from "react";
import axios from "axios";

const ProductPage = () => {
  const product = {
    id: "prod_1",
    name: "Awesome Gadget",
    price: 2, // rupees
    image: "https://via.placeholder.com/300x200.png?text=Awesome+Gadget",
  };

  const handlePayment = async () => {
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
            }
          );
          if (verifyRes.data.success) {
            alert("Payment successful 🎉");
          } else {
            alert("Payment verification failed");
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px", height: "200px", objectFit: "cover" }}
      />
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <button
        onClick={handlePayment}
        style={{
          backgroundColor: "#3399cc",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default ProductPage;
