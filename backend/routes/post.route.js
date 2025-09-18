import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { addComment, addnNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUserPosts,likePost,addNewReel, getAllReels,addNewProduct, getAllProducts} from '../controllers/post.controller.js';    


import { imageUpload, videoUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated,imageUpload.single('image'),addnNewPost);
router.route("/products/add").post(isAuthenticated, imageUpload.single('image'), addNewProduct);
router.route("/product/all").get(isAuthenticated, getAllProducts);  
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/reel/all").get(isAuthenticated, getAllReels);
router.route("/userpost/all").get(isAuthenticated,getUserPosts);
router.route("/:id/like").get(isAuthenticated,likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost); 
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
router.route("/addreel").post(isAuthenticated,videoUpload.single('video'),addNewReel);

export default router;