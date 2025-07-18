import { toast } from '@/components/ui/use-toast';

// TTS voice options
export enum TtsVoiceType {
  MALE = 'male',
  FEMALE = 'female',
  NEUTRAL = 'neutral'
}

export interface TtsVoice {
  id: string;
  name: string;
  type: TtsVoiceType;
  language: string;
  description?: string;
}

export interface TtsOptions {
  voice: string;
  speed: number;
  pitch: number;
  format?: 'mp3' | 'wav' | 'ogg';
}

// Default voices available
export const AVAILABLE_VOICES: TtsVoice[] = [
  {
    id: 'en-US-Neural2-F',
    name: 'Aria',
    type: TtsVoiceType.FEMALE,
    language: 'en-US',
    description: 'Professional female voice with natural intonation'
  },
  {
    id: 'en-US-Neural2-M',
    name: 'Ryan',
    type: TtsVoiceType.MALE,
    language: 'en-US',
    description: 'Professional male voice with natural intonation'
  },
  {
    id: 'en-GB-Neural2-F',
    name: 'Emma',
    type: TtsVoiceType.FEMALE,
    language: 'en-GB',
    description: 'British female voice with natural intonation'
  },
  {
    id: 'en-GB-Neural2-M',
    name: 'James',
    type: TtsVoiceType.MALE,
    language: 'en-GB',
    description: 'British male voice with natural intonation'
  },
  {
    id: 'en-AU-Neural2-F',
    name: 'Olivia',
    type: TtsVoiceType.FEMALE,
    language: 'en-AU',
    description: 'Australian female voice with natural intonation'
  }
];

// Default TTS options
export const DEFAULT_TTS_OPTIONS: TtsOptions = {
  voice: 'en-US-Neural2-F',
  speed: 1.0,
  pitch: 0,
  format: 'mp3'
};

// TTS Service class for Google Cloud TTS integration
export class TtsService {
  private apiKey: string | null = null;
  private options: TtsOptions;
  private baseUrl: string = 'https://texttospeech.googleapis.com/v1';
  private isCancelled: boolean = false;

  constructor(apiKey?: string, options?: Partial<TtsOptions>) {
    this.apiKey = apiKey || null;
    this.options = { ...DEFAULT_TTS_OPTIONS, ...(options || {}) };
  }

  // Set or update the API key
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Get the current API key
  public getApiKey(): string | null {
    return this.apiKey;
  }

  // Update TTS options
  public setOptions(options: Partial<TtsOptions>): void {
    this.options = { ...this.options, ...options };
  }

  // Get current TTS options
  public getOptions(): TtsOptions {
    return { ...this.options };
  }

  // Cancel ongoing synthesis
  public cancel(): void {
    this.isCancelled = true;
  }

  // Reset cancel flag
  private resetCancel(): void {
    this.isCancelled = false;
  }

  // Convert text to speech and return audio data
  public async synthesizeSpeech(text: string, options?: Partial<TtsOptions>): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error('TTS API key not set. Please configure your API key in settings.');
    }

    this.resetCancel();
    
    const mergedOptions = { ...this.options, ...(options || {}) };
    const audioEncoding = mergedOptions.format === 'mp3' ? 'MP3' : 
                         mergedOptions.format === 'wav' ? 'LINEAR16' : 'OGG_OPUS';

    try {
      const response = await fetch(`${this.baseUrl}/text:synthesize?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            text
          },
          voice: {
            languageCode: mergedOptions.voice.split('-').slice(0, 2).join('-'),
            name: mergedOptions.voice
          },
          audioConfig: {
            audioEncoding,
            speakingRate: mergedOptions.speed,
            pitch: mergedOptions.pitch
          }
        })
      });

      if (this.isCancelled) {
        throw new Error('TTS synthesis cancelled');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `TTS API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert base64 audio content to ArrayBuffer
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return bytes.buffer;
    } catch (error) {
      console.error('TTS synthesis error:', error);
      
      if (this.isCancelled) {
        throw new Error('TTS synthesis cancelled');
      }
      
      throw error;
    }
  }

  // Convert text to speech and save as audio blob
  public async synthesizeToBlob(text: string, options?: Partial<TtsOptions>): Promise<Blob> {
    const audioBuffer = await this.synthesizeSpeech(text, options);
    
    const format = options?.format || this.options.format || 'mp3';
    const mimeType = format === 'mp3' ? 'audio/mpeg' : 
                     format === 'wav' ? 'audio/wav' : 'audio/ogg';
    
    return new Blob([audioBuffer], { type: mimeType });
  }

  // Convert text to speech and play audio
  public async synthesizeAndPlay(text: string, options?: Partial<TtsOptions>): Promise<HTMLAudioElement> {
    const blob = await this.synthesizeToBlob(text, options);
    const audioUrl = URL.createObjectURL(blob);
    
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: 'Audio Playback Error',
        description: 'Could not play the synthesized audio.',
        variant: 'destructive'
      });
    });
    
    // Clean up the URL when done
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return audio;
  }

  // Break long text into smaller chunks for better synthesis
  public async synthesizeLongText(
    text: string, 
    options?: Partial<TtsOptions>, 
    progressCallback?: (progress: number) => void
  ): Promise<Blob[]> {
    // Split text into sentences (simple split by periods, question marks, exclamation points)
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Group sentences into chunks of reasonable size (max ~3000 chars)
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > 3000) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    // Synthesize each chunk
    const audioBlobs: Blob[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      if (this.isCancelled) {
        break;
      }
      
      const blob = await this.synthesizeToBlob(chunks[i], options);
      audioBlobs.push(blob);
      
      if (progressCallback) {
        progressCallback((i + 1) / chunks.length);
      }
    }
    
    return audioBlobs;
  }

  // Combine multiple audio blobs into a single blob
  public async combineAudioBlobs(blobs: Blob[]): Promise<Blob> {
    if (blobs.length === 0) {
      throw new Error('No audio blobs to combine');
    }
    
    if (blobs.length === 1) {
      return blobs[0];
    }
    
    // Convert blobs to array buffers
    const buffers = await Promise.all(
      blobs.map(blob => 
        new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        })
      )
    );
    
    // Calculate total length
    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
    
    // Create a new buffer with the total length
    const combinedBuffer = new Uint8Array(totalLength);
    
    // Copy data from each buffer
    let offset = 0;
    for (const buffer of buffers) {
      combinedBuffer.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }
    
    return new Blob([combinedBuffer], { type: blobs[0].type });
  }
}

// Create a singleton instance
let ttsServiceInstance: TtsService | null = null;

export const getTtsService = (apiKey?: string): TtsService => {
  if (!ttsServiceInstance) {
    ttsServiceInstance = new TtsService(apiKey);
  } else if (apiKey) {
    ttsServiceInstance.setApiKey(apiKey);
  }
  
  return ttsServiceInstance;
};

export const resetTtsService = (): void => {
  ttsServiceInstance = null;
}; 