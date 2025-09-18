import React, { useEffect, useRef, useState } from "react";
import useReelStore from "../just/reelStore.js";
import useGetAllReels from "../hooks/useGetAllReels.jsx";

const ReelsPage = () => {
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
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <h2 className="text-xl font-bold mb-4 flex justify-center sticky top-0 bg-white z-10">
        Reels
      </h2>

      <div className="flex flex-col">
        {reels?.map((reel, index) => (
          <div
            key={reel?._id}
            className="h-screen flex justify-center items-center snap-start"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              data-index={index}
              src={reel?.videoUrl}
              className="h-full w-auto object-contain rounded-xl"
              playsInline
              loop
              // tap on video toggles play/pause
              onClick={() => handleToggle(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
