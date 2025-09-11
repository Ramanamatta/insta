import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Button } from './ui/button.jsx';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// import Zustand stores instead of Redux
import useAuthStore from '../just/authStore.js';
import usePostStore from '../just/postStore.js';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // grab state from Zustand stores
  const user = useAuthStore((state) => state.user);
  const posts = usePostStore((state) => state.posts);
  const setPosts = usePostStore((state) => state.setPosts);

  const API_URL = import.meta.env.VITE_API_URL;

  const fileChangeHandler = async (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const dataUrl = await readFileAsDataURL(selected);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/post/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        // update Zustand store instead of Redux dispatch
        setPosts([res.data.post, ...posts]);
        toast.success(res.data.message);
        setOpen(false);
        setCaption("");
        setFile("");
        setImagePreview("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>

        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.name}</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write caption.."
          className="focus-visible:ring-transparent border-none"
        />

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt='preview_img' className='w-full h-full object-cover rounded-md' />
          </div>
        )}

        <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from Computer
        </Button>

        {imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please Wait...
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
