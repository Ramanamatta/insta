import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Button } from './ui/button.jsx';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// Zustand stores
import useAuthStore from '../just/authStore.js';
import useReelStore from '../just/reelStore.js'; // create a store like postStore

const CreateReel = ({ open, setOpen }) => {
  const fileRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // get state from Zustand stores
  const user = useAuthStore((state) => state.user);
  const reels = useReelStore((state) => state.reels);
  const setReels = useReelStore((state) => state.setReels);

  const API_URL = import.meta.env.VITE_API_URL;

  const fileChangeHandler = async (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // for preview
      const dataUrl = await readFileAsDataURL(selected);
      setVideoPreview(dataUrl);
    }
  };

  const createReelHandler = async () => {
    const formData = new FormData();
    formData.append('video', file); // videoFile is the File object
    formData.append('caption', caption);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/post/addreel`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(res)

      if (res.data.success) {
        setReels([res.data.reel, ...reels]);
        toast.success(res.data.message);
        setOpen(false);
        setCaption('');
        setFile('');
        setVideoPreview('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Reel
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.name}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write caption.."
          className="focus-visible:ring-transparent border-none"
        />

        {videoPreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <video
              src={videoPreview}
              controls
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => fileRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select Video
        </Button>

        {videoPreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait...
            </Button>
          ) : (
            <Button
              onClick={createReelHandler}
              type="submit"
              className="w-full"
            >
              Post Reel
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreateReel;
