import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Reel } from "../models/reel.model.js";
import { User } from "./../models/user.model.js";
import { Comment } from "../models/coment.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import { Product } from "../models/product.model.js"; 

export const addnNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const authorId = req.id;
    const image = req.file;
    if (!image) {
      return res
        .status(400)
        .json({ message: "Image required", success: false });
    }

    // Resize the image using sharp
    const optimzedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to date uri
    const fileUri = `data:image/jpeg;base64,${optimzedImageBuffer.toString(
      "base64"
    )}`;
    const couldResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: couldResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res
      .status(201)
      .json({ message: "Post created successfully", post, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addNewProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const sellerId = req.id; // from auth middleware
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json({ message: "Product image required", success: false });
    }

    // resize image like post controller
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: cloudResponse.secure_url,
      seller: sellerId,
    });

    // push to user products array (optional)
    const user = await User.findById(sellerId);
    if (user) {
      user.products.push(product._id);
      await user.save();
    }

    await product.populate({ path: "seller", select: "-password" });

    return res
      .status(201)
      .json({ message: "Product added successfully", product, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const addNewReel = async (req, res) => {
  try {
    const { caption } = req.body;
    const authorId = req.id;
    const video = req.file;

    if (!video) {
      return res.status(400).json({ message: "Video required", success: false });
    }

    // Upload the video to Cloudinary (resource_type must be video)
    const cloudResponse = await cloudinary.uploader.upload(video.path || `data:video/mp4;base64,${video.buffer.toString("base64")}`, {
      resource_type: "video",
      // folder: "reels", // optional folder name
    });

    // generate a thumbnail (Cloudinary auto-generates poster images)
    const thumbnailUrl = cloudinary.url(cloudResponse.public_id + ".jpg", {
      resource_type: "video",
      start_offset: "1", // take frame at 1s
    });

    // Save reel in DB
    const reel = await Reel.create({
      caption,
      videoUrl: cloudResponse.secure_url,
      thumbnailUrl,
      author: authorId,
    });

    // Push reel reference to user
    const user = await User.findById(authorId);
    if (user) {
      user.reels.push(reel._id);
      await user.save();
    }

    await reel.populate({ path: "author", select: "-password" });

    return res
      .status(201)
      .json({ message: "Reel created successfully", reel, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // fetch all products newest first
    const products = await Product.find()
      .sort({ createdAt: -1 }) // make sure your schema has timestamps:true
      .populate({
        path: "seller",
        select: "name profilePicture email" // fields you want to show
      });

    return res.status(200).json({ products, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate({ path: "author", select: "-password" })
      .sort({ createdAt: -1 }); // newest first
    return res.status(200).json({ reels, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch reels", success: false });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'name profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: { path: 'author', select: 'name profilePicture' },
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "name profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "name profilePicture" },
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) { }
};

export const likePost = async (req, res) => {
  try {
    const likekarnewalakaUserKId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    //like logic started

    await post.updateOne({ $addToSet: { likes: likekarnewalakaUserKId } });
    await post.save();

    //implemnting socket io for real time notification

    const user = await User.findById(likekarnewalakaUserKId).select('name profilePicture');
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likekarnewalakaUserKId) {
      //emit a notification to the post owner
      const notifaction = {
        type: 'like',
        userId: likekarnewalakaUserKId,
        userDetails: user,
        postId,
        message: ' liked your post',
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notifaction);
    }

    return res.status(200).json({ message: "Post Liked", success: true });
  } catch (error) { }
};

export const dislikePost = async (req, res) => {
  try {
    const likekarnewalakaUserKId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    //Dislike logic started

    await post.updateOne({ $pull: { likes: likekarnewalakaUserKId } });
    await post.save();

    //implemnting socket io for real time notification

    const user = await User.findById(likekarnewalakaUserKId).select('name profilePicture');
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likekarnewalakaUserKId) {
      //emit a notification to the post owner
      const notifaction = {
        type: 'dislike',
        userId: likekarnewalakaUserKId,
        userDetails: user,
        postId,
        message: ' liked your post',
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notifaction);
    }


    return res.status(200).json({ message: "Post disLiked", success: true });
  } catch (error) {
    console.log(error)
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text) return res.status(400).json({ message: 'text is required', success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId
    })

    await comment.populate({
      path: 'author',
      select: "username profilePicture"
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: 'Comment Added',
      comment,
      success: true
    })

  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "name profilePicture",
    });

    if (!comments) {
      return res
        .status(404)
        .json({ message: "Comments not found", success: false });
    }
    return res.status(200).json({ comments, success: true });
  } catch (error) { }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }
    // Check if the user is the author of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: " unAuthorized", success: false });
    }

    //delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the post id from the author's posts array
    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    //delete all comments related to the post
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "Post deleted successfully", success: true });

  } catch (error) {
    console.log(error);
  }
}
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // If the post is already bookmarked, remove it from bookmarks
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ type: 'unsaved', message: "Post removed from bookmarks", success: true });
    }
    else {
      // If the post is not bookmarked, add it to bookmarks
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ type: 'saved', message: "Post bookmarked", success: true });
    }

  } catch (error) {
    console.log(error);
  }
} 