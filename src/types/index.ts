
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Channel {
  id: string;
  name: string;
  platform: 'youtube' | 'instagram';
  avatar: string;
  subscribers: number;
  isZeroTouchEnabled: boolean;
  brandVoice?: string;
  status: 'healthy' | 'warning' | 'error';
}

export interface Video {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  status: 'backlog' | 'idea-generation' | 'scripting' | 'asset-generation' | 'editing' | 'review' | 'scheduled' | 'published';
  thumbnail?: string;
  views?: number;
  likes?: number;
  comments?: number;
  viralityScore?: number;
  dueDate?: string;
  progress: number;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'generating' | 'review' | 'scheduled' | 'completed';
  progress: number;
  createdAt: string;
}

export interface Analytics {
  totalViews24h: number;
  newSubscribers24h: number;
  videosPublishedMonth: number;
  engagementRate: number;
  subscriberGrowth: number[];
  viewsPerVideo: number[];
  trafficSources: Record<string, number>;
}
