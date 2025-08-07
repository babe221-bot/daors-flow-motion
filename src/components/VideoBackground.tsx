import React, { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onended = () => {
        video.play();
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={videoSrc}
        autoPlay
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-background opacity-60" />
    </div>
  );
};

export default VideoBackground;
