import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import useAuthStore from "../just/authStore.js";

const RightSidebar = () => {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div className="hidden xl:block w-80 px-6 py-8 border-l border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">
            <Link to={`/profile/${user?._id}`}>{user?.name}</Link>
          </h1>
          <span className="text-gray-600 text-sm truncate block">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
