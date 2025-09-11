import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";


import useAuthStore from "../just/authStore.js";


const SuggestedUsers = () => {
  const  suggestedUsers  = useAuthStore((state) => state.suggestedUsers);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div key={user?._id} className=" flex items-center justify-between my-5">
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
              <span className="text-[#3BADF8] font-bold cursor-pointer hover:text-[#7eb4de] ml-5 text-sm">Follow</span>

          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
