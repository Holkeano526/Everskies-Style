
export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null;
  loadingMessage: string;
}

export interface UserInput {
  image: File | null;
  previewUrl: string | null;
  base64: string | null;
}

export enum StyleVariation {
  Classic = 'classic',
  Soft = 'soft',
  Sharp = 'sharp'
}
