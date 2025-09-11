import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "./ui/button.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


import useAuthStore from "../just/authStore.js";

const EditProfile = () => {
  const immageRef = useRef();
  const [loading,setLoading]=useState(false);

  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const API_URL = import.meta.env.VITE_API_URL;
  const [input,setInput]=useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  });
  const navigate = useNavigate();
  const fileChangeHandler = (e) => {
    const file=e.target.files?.[0];
    if(file){
      setInput({...input,profilePhoto:file});
    }
  }
  
  const selectChangeHandler = (value) => {
    setInput({...input,gender:value});   
  }

  // const bioChangeHandler = (value) => {
  //   setInput({...input,bio:value});
  // }

  const ediProfleHandler=async(e)=>{
    console.log(input)

     const formData=new FormData();
     formData.append("bio",input.bio);
     formData.append("gender",input.gender)
     if(input.profilePhoto){
      formData.append("profilePhoto", input.profilePhoto);
     }

  try {
      setLoading(true);
      const res=await axios.post(`${API_URL}/api/v1/user/profile/edit`,formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,  
      });
      if (res.data.success) {
      const updateUserData = {
        ...user,
        bio: res.data.user?.bio,
        profilePicture: res.data.user?.profilePicture,
        gender: res.data.user?.gender
      };
      setAuthUser(updateUserData);
      navigate(`/profile/${user?._id}`);
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong, please try again later.");
  }
  finally{
    setLoading(false);
  }
}
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.name}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={immageRef} onChange={fileChangeHandler} type="file" className="hidden" />
          <Button onChange={fileChangeHandler}
            onClick={() => {
              immageRef?.current.click();
            }}
            className="bg-[#0095F6] hover:bg-[#318bc7] h-8 cursor-pointer"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input.value} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {
            loading ? (
              <Button className='w-fit bg-[#0095F6] hover:bg-[#318bc7]'>
                <Loader2 className="nr-2 h-4 w-4 animate-spin" />
                Please wait...</Button>
            ) :(
              <Button onClick={ediProfleHandler} className='w-fit bg-[#0095F6] hover:bg-[#318bc7]'>Submit</Button>

            )
          }
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
