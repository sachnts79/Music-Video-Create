
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';
export type Duration = 'short' | 'medium' | 'long';

export interface VideoOptions {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  duration: Duration;
  effects: string[];
}

// A simplified type for the Veo operation object
export interface VideoOperation {
    name: string;
    done: boolean;
    response?: {
        generatedVideos: {
            video: {
                uri: string;
                aspectRatio?: AspectRatio;
            }
        }[];
    };
    error?: {
        code: number;
        message: string;
    }
}
