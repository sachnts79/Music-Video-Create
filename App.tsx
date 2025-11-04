
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { ApiKeySelector } from './components/ApiKeySelector';
import { FileUploader } from './components/FileUploader';
import { OptionsPanel } from './components/OptionsPanel';
import { Loader } from './components/Loader';
import { VideoPlayer } from './components/VideoPlayer';
import { generateMusicVideo } from './services/geminiService';
import type { VideoOptions, VideoOperation } from './types';
import { DownloadIcon } from './components/IconComponents';

// FIX: Removed conflicting global type declaration.
// The `aistudio` object on window is expected to be defined by the environment.

export default function App() {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<VideoOptions>({
    aspectRatio: '16:9',
    resolution: '720p',
    duration: 'short',
    effects: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const audioUrl = audio ? URL.createObjectURL(audio) : null;

  const checkApiKey = useCallback(async () => {
    setIsCheckingApiKey(true);
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } else {
        // Fallback for environments where aistudio is not available
        setApiKeySelected(!!process.env.API_KEY);
      }
    } catch (e) {
      console.error("Error checking API key:", e);
      setApiKeySelected(false);
    } finally {
      setIsCheckingApiKey(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);
  
  const handleApiKeySelect = useCallback(async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success to avoid race conditions and re-check
      setApiKeySelected(true);
    }
  }, []);


  const handleGenerate = async () => {
    if (!image || !audio || !prompt || !apiKeySelected) {
      setError('Please provide an image, audio file, a prompt, and select an API key.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgressMessages(['Initializing video generation...']);
    setGeneratedVideoUrl(null);
    
    try {
      const videoBlob = await generateMusicVideo(
        image,
        prompt,
        options,
        (message) => {
          setProgressMessages(prev => [...prev, message]);
        }
      );
      const url = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (errorMessage.includes("Requested entity was not found")) {
        errorMessage = "Your API key is invalid or not found. Please select a valid key.";
        setApiKeySelected(false); // Reset key state to re-trigger selection
      }
      setError(`Failed to generate video: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
      setProgressMessages([]);
    }
  };

  const isFormComplete = !!image && !!audio && !!prompt.trim();

  if (isCheckingApiKey) {
    return <div className="flex items-center justify-center min-h-screen"><Loader messages={['Checking API Key...']} /></div>;
  }
  
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />

        {!apiKeySelected ? (
          <ApiKeySelector onSelectKey={handleApiKeySelect} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {isGenerating && <Loader messages={progressMessages} />}

            {!isGenerating && !generatedVideoUrl && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FileUploader
                    id="image-uploader"
                    label="Upload Image"
                    accept="image/*"
                    onFileChange={setImage}
                    file={image}
                  />
                  <FileUploader
                    id="audio-uploader"
                    label="Upload Background Music"
                    accept="audio/*"
                    onFileChange={setAudio}
                    file={audio}
                  />
                </div>
                <OptionsPanel
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  options={options}
                  onOptionChange={setOptions}
                />
                <div className="text-center pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!isFormComplete || isGenerating}
                    className="bg-brand-primary text-brand-bg font-bold py-3 px-12 rounded-full shadow-lg hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-300 disabled:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50 transform hover:scale-105"
                  >
                    Generate Music Video
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative text-center" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {generatedVideoUrl && audioUrl && (
              <div className="space-y-6 flex flex-col items-center">
                 <h2 className="text-3xl font-bold text-center text-brand-accent">Your Video is Ready!</h2>
                <VideoPlayer videoSrc={generatedVideoUrl} audioSrc={audioUrl} />
                <a
                  href={generatedVideoUrl}
                  download={`music-video-${Date.now()}.mp4`}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
                >
                  <DownloadIcon />
                  Download Video
                </a>
                 <button
                    onClick={() => setGeneratedVideoUrl(null)}
                    className="mt-4 bg-brand-secondary text-brand-text font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-50 transition-all duration-300"
                  >
                    Create Another Video
                  </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
