
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import type { VideoOptions } from "../types";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:image/jpeg;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const DURATION_STEPS = {
  short: 1,
  medium: 2,
  long: 3,
};

const POLLING_INTERVAL = 10000; // 10 seconds

// FIX: Removed generic type and used GenerateVideosOperation from the SDK to fix type errors.
async function pollOperation(
  ai: GoogleGenAI,
  operation: GenerateVideosOperation,
  onProgress: (message: string) => void
): Promise<GenerateVideosOperation> {
  let currentOperation = operation;
  while (!currentOperation.done) {
    onProgress(`Checking generation status... (will check again in ${POLLING_INTERVAL / 1000}s)`);
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
  }
  return currentOperation;
}


export const generateMusicVideo = async (
  image: File,
  prompt: string,
  options: VideoOptions,
  onProgress: (message: string) => void
): Promise<Blob> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  // Create a new instance right before the call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageBase64 = await fileToBase64(image);

  let finalPrompt = prompt;
  if (options.effects && options.effects.length > 0) {
      const effectsString = options.effects.join(', ');
      finalPrompt = `${effectsString} style. ${prompt}`;
      onProgress(`Applying effects: ${effectsString}`);
  }

  const totalSteps = DURATION_STEPS[options.duration];
  // FIX: Use GenerateVideosOperation from the SDK instead of custom VideoOperation type.
  let finalOperation: GenerateVideosOperation | null = null;
  
  // Step 1: Initial generation
  onProgress(`[Step 1/${totalSteps}] Starting initial video clip generation...`);
  let initialOp = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: finalPrompt,
    image: {
      imageBytes: imageBase64,
      mimeType: image.type,
    },
    config: {
      numberOfVideos: 1,
      resolution: options.resolution,
      aspectRatio: options.aspectRatio,
    }
  });

  finalOperation = await pollOperation(ai, initialOp, (msg) => onProgress(`[Step 1/${totalSteps}] ${msg}`));

  if (!finalOperation.response?.generatedVideos?.[0]?.video) {
    throw new Error('Initial video generation failed to produce a video.');
  }

  // Steps 2 to N: Extend video if necessary
  for (let i = 2; i <= totalSteps; i++) {
    onProgress(`[Step ${i}/${totalSteps}] Extending video... This adds ~4 seconds.`);
    
    if (!finalOperation?.response?.generatedVideos?.[0]?.video) {
        throw new Error(`Failed to get previous video segment for extension at step ${i}.`);
    }

    let extensionOp = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: "continue the video, make the scene evolve naturally.", // Generic prompt for extension
        video: finalOperation.response.generatedVideos[0].video,
        config: {
            numberOfVideos: 1,
            resolution: '720p', // Extension API currently supports 720p
            aspectRatio: options.aspectRatio,
        }
    });

    finalOperation = await pollOperation(ai, extensionOp, (msg) => onProgress(`[Step ${i}/${totalSteps}] ${msg}`));
    
    if (!finalOperation.response?.generatedVideos?.[0]?.video) {
        throw new Error(`Video extension failed at step ${i}.`);
    }
  }

  onProgress("All video segments generated. Downloading final video...");
  const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Could not retrieve download link for the final video.");
  }

  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download the video file. Status: ${videoResponse.statusText}`);
  }

  const videoBlob = await videoResponse.blob();
  onProgress("Video download complete!");
  return videoBlob;
};
