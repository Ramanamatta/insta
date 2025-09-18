import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1) create order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // in rupees

    const options = {
      amount: Math.round(amount * 100), // convert rupees -> paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Create order error", err);
    res.status(500).json({ error: "Unable to create order" });
  }
};

// 2) verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId, amount } = req.body;
    const userId = req.id;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Create order after successful payment
      const order = await Order.create({
        user: userId,
        product: productId,
        totalAmount: amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      return res.json({ success: true, message: "Payment verified and order created", order });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verify error", err);
    res.status(500).json({ error: "Verification failed" });
  }
};
