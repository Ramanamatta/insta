import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' }, 
    gender: { type: String, enum:['Male','Female']},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
},{timestamp: true});
export const User = mongoose.model('User', userSchema);