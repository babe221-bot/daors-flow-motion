import React from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoSrc }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
      />
      <div className="absolute inset-0 bg-black opacity-50" />
    </div>
  );
};

export default VideoBackground;
