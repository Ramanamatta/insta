import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  category: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  image: { type: String, required: true }, // cloudinary url
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // optional: if you want likes/reviews
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      rating: Number
    }
  ],
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
