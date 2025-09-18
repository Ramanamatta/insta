import React, { useEffect, useRef, useState } from "react";
import useReelStore from "../just/reelStore.js";
import useGetAllReels from "../hooks/useGetAllReels.jsx";
import RightSidebar from './RightSidebar';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const ReelsPage = () => {
  useGetSuggestedUsers();
  useGetAllReels();
  const reels = useReelStore((state) => state.reels);

  const videoRefs = useRef([]); // hold refs to video elements
  const [playingIndex, setPlayingIndex] = useState(null); // which reel is playing

  // Pause/reset any video leaving viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (!entry.isIntersecting) {
            const video = entry.target;
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
            if (playingIndex === idx) {
              setPlayingIndex(null);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels, playingIndex]);

  const handleToggle = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    // if this video is playing -> pause
    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
    } else {
      // pause & reset all others
      videoRefs.current.forEach((v, idx) => {
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      });
      // play this one with sound
      video.muted = false;
      video.currentTime = 0;
      video.play().catch((err) => console.log(err));
      setPlayingIndex(index);
    }
  };

  return (
    <div className='flex min-h-screen pt-16 lg:pt-0'>
      <div className='flex-1 max-w-full lg:max-w-2xl mx-auto'>
        <div className="min-h-screen overflow-y-scroll snap-y snap-mandatory bg-black lg:bg-white">
          <h2 className="text-xl font-bold py-4 flex justify-center sticky top-16 lg:top-0 bg-black lg:bg-white text-white lg:text-black z-10">
            Reels
          </h2>

          <div className="flex flex-col">
            {reels?.map((reel, index) => (
              <div
                key={reel?._id}
                className="h-screen flex justify-center items-center snap-start relative"
              >
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  data-index={index}
                  src={reel?.videoUrl}
                  className="h-full w-full max-w-sm lg:max-w-md object-cover rounded-lg lg:rounded-xl"
                  playsInline
                  loop
                  onClick={() => handleToggle(index)}
                />
                {/* Play/Pause indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {playingIndex !== index && (
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RightSidebar/>
    </div>
  );
};

export default ReelsPage;
