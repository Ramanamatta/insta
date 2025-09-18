import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Play,
  Film,
  PackagePlus ,
  ShoppingBag, // new icon for orders
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import CreatePost from "./CreatePost.jsx";
import CreateReel from "./CreateReel.jsx"; // ⬅️ import your CreateReel component
import AddProduct from "./AddProduct.jsx";  

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx";
import { Button } from "./ui/button.jsx";

import useAuthStore from "../just/authStore.js";
import usePostStore from "../just/postStore.js";
import useRtnStore from "../just/rtnStore.js";

const LeftSidebar = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const setPosts = usePostStore((state) => state.setPosts);
  const setSelectedPost = usePostStore((state) => state.setSelectedPost);
  const likeNotifications = useRtnStore((state) => state.likeNotifications);

  const [openPost, setOpenPost] = useState(false);
  const [openReel, setOpenReel] = useState(false); // ⬅️ state for reel modal
  const [openProduct, setOpenProduct] = useState(false); // state for product modal 
  const API_URL = import.meta.env.VITE_API_URL;

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <PackagePlus  />, text: "Add Product" },
    { icon: <TrendingUp />, text: "Products" },
    { icon: <TrendingUp />, text: "all Products" },
    { icon: <ShoppingBag />, text: "My Orders" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create Post" },
    { icon: <Film />, text: "Create Reel" },
    { icon: <Play />, text: "Reels" },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAuthUser(null);
        setSelectedPost(null);
        setPosts([]);
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create Post") {
      setOpenPost(true);
    } else if (textType === "Create Reel") {
      setOpenReel(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
    else if (textType === 'Reels') {
   navigate('/reels');   
    }
    else if (textType === 'Products') {
      navigate('/products');   
    }
    else if (textType === 'all Products') {
      navigate('/all-products');   
    }
    else if (textType === "Add Product") {
      setOpenProduct(true);
    }
    else if (textType === "My Orders") {
      navigate('/orders');
    }

  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col h-full">
        <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => {
                  sidebarHandler(item.text);
                }}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}

                <span>{item.text}</span>
                {item.text === "Notifications" && likeNotifications.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6 cursor-pointer"
                      >
                        {likeNotifications.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {likeNotifications.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          likeNotifications.map((notification) => {
                            return (
                              <div
                                key={notification.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={notification.userDetails?.profilePicture}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.name}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {/* Create Post modal */}
        <CreatePost open={openPost} setOpen={setOpenPost} />
        {/* Create Reel modal */}
        <CreateReel open={openReel} setOpen={setOpenReel} />
        {/* Add Product modal */}
        <AddProduct open={openProduct} setOpen={setOpenProduct} />  
      </div>
    </div>
  );
};

export default LeftSidebar;
