
import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  audioSrc: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, audioSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const syncPlay = () => {
    if (videoRef.current && audioRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      audioRef.current.play();
    }
  };

  const syncPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const syncSeek = () => {
    if (videoRef.current && audioRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', syncPlay);
      videoElement.addEventListener('pause', syncPause);
      videoElement.addEventListener('seeking', syncSeek);

      return () => {
        videoElement.removeEventListener('play', syncPlay);
        videoElement.removeEventListener('pause', syncPause);
        videoElement.removeEventListener('seeking', syncSeek);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc, audioSrc]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-secondary">
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        loop
        className="w-full h-full"
        onLoadedMetadata={(e) => {
            if (audioRef.current) {
                audioRef.current.volume = 0.5;
            }
        }}
      />
      <audio ref={audioRef} src={audioSrc} loop className="hidden" />
    </div>
  );
};
   