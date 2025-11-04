
import React from 'react';
import { VideoIcon } from './IconComponents';

export const Header: React.FC = () => (
  <header className="text-center mb-10 md:mb-12">
    <div className="inline-flex items-center justify-center gap-4 mb-4">
        <VideoIcon className="w-12 h-12 text-brand-primary" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Music Video Creator AI
        </h1>
    </div>
    <p className="max-w-3xl mx-auto text-lg text-brand-text-secondary">
      Turn any image into a dynamic music video. Just upload your visuals and audio, describe the scene, and let our AI bring your vision to life.
    </p>
  </header>
);
   