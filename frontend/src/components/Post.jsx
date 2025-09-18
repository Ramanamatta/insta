import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog.jsx";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { toast } from "sonner";
import axios from "axios";

import { Badge } from '../components/ui/badge.jsx'

import useAuthStore from "../just/authStore.js";
import usePostStore from "../just/postStore.js";  


const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const  user  = useAuthStore((state) => state.user);
  const  posts  = usePostStore((state) => state.posts);
  const setPosts = usePostStore((state) => state.setPosts);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);

  const [comment, setComment] = useState(post.comments);
  const API_URL = import.meta.env.VITE_API_URL;

  // Derived liked state (not useState)
  const liked = post.likes.includes(user?._id);

  const onChangeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        setPosts(updatedData);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${API_URL}/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p
        );
        setPosts(updatedPosts);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Like/dislike failed");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        setPosts(updatedPostData);
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/post/${post._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Bookmark failed");
    }
  }
  return (
    <div className="my-4 lg:my-8 w-full max-w-md lg:max-w-lg mx-auto bg-white border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between px-2 lg:px-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm lg:text-base">{post.author?.name}</h1>
            {user._id === post.author._id && <Badge variant="secondary" className="text-xs">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post.author._id !== user._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#ED4956] font-bold"
                >
                  Unfollow
                </Button>
              )
            }

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favourites
            </Button>
            {user && user?._id === post.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="w-full aspect-square object-cover my-3"
        src={post.image}
        alt="post_image"
      />

      <div className="px-2 lg:px-0">
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-4">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={"24px"}
                className="cursor-pointer text-red-500"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"24px"}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
            <MessageCircle
              onClick={() => {
                setSelectedPost(post);
                setOpen(true);
              }}
              size={24}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send size={24} className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark onClick={bookmarkHandler} size={24} className="cursor-pointer hover:text-gray-600" />
        </div>

        <span className="font-semibold block mb-2 text-sm">{post.likes.length} likes</span>
        <p className="text-sm mb-2">
          <span className="font-semibold mr-2">{post.author.name}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              setSelectedPost(post);
              setOpen(true);
            }}
            className="cursor-pointer text-sm text-gray-500 block mb-2"
          >
            View all {comment.length} comments
          </span>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={onChangeEventHandler}
            className="outline-none text-sm w-full bg-transparent"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-blue-500 cursor-pointer font-semibold text-sm ml-2"
            >
              Post
            </span>
          )}
        </div>
      </div>

      <CommentDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Post;
