
import React, { useState, useEffect } from 'react';

interface LoaderProps {
  messages: string[];
}

export const Loader: React.FC<LoaderProps> = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [messages]);
  
  const displayedMessage = messages.length > 0 ? messages[currentMessageIndex] : "Processing...";

  return (
    <div className="fixed inset-0 bg-brand-bg bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <div className="mt-6 text-center text-lg text-brand-text-secondary w-full px-4">
        {messages.map((msg, index) => (
             <p key={index} className={`transition-opacity duration-500 ${index === currentMessageIndex ? 'opacity-100' : 'opacity-0 hidden'}`}>
             {msg}
           </p>
        ))}
         {messages.length === 0 && <p>Processing...</p>}
      </div>
      <p className="mt-4 text-sm text-brand-text-secondary/70">Video generation can take a few minutes. Please be patient.</p>
    </div>
  );
};
   