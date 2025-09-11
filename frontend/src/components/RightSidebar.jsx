import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";


import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

import useAuthStore from "../just/authStore.js";

const RightSidebar = () => {
  const  user  = useAuthStore((state) => state.user);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.name}</Link>
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
