import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-player-card">
      {src ? (
        <video
          ref={videoRef}
          className="video-player"
          src={src}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="video-placeholder">No video selected</div>
      )}
    </div>
  );
}

export default VideoPlayer; 