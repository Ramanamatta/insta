const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [{ productId: String, name: String, qty: Number, price: Number }],
  amount: { type: Number, required: true }, // rupees
  currency: { type: String, default: 'INR' },
  receipt: String,
  status: { type: String, enum: ['created','paid','failed','refunded'], default: 'created' },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
