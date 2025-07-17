
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  Play,
  Eye,
  Check,
  X,
  MoreHorizontal,
  Shuffle
} from 'lucide-react';
import { Video } from '../types';

const ContentStudio = () => {
  const [autoRemixEnabled, setAutoRemixEnabled] = useState(false);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-500' },
    { id: 'idea-generation', title: 'Idea Generation', color: 'bg-blue-500' },
    { id: 'scripting', title: 'Scripting', color: 'bg-purple-500' },
    { id: 'asset-generation', title: 'Asset Generation', color: 'bg-green-500' },
    { id: 'editing', title: 'Editing & Rendering', color: 'bg-yellow-500' },
    { id: 'review', title: 'Ready for Review', color: 'bg-orange-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-indigo-500' },
    { id: 'published', title: 'Published', color: 'bg-emerald-500' },
  ];

  const videos: Video[] = [
    {
      id: '1',
      title: 'AI Revolution in Healthcare',
      channel: 'TechMed',
      channelId: 'techmed',
      status: 'backlog',
      progress: 0,
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Quantum Computing Explained',
      channel: 'ScienceDaily',
      channelId: 'sciencedaily',
      status: 'scripting',
      progress: 45,
      dueDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Mars Colony Updates',
      channel: 'SpaceNews',
      channelId: 'spacenews',
      status: 'review',
      progress: 100,
      dueDate: '2024-01-18'
    },
    {
      id: '4',
      title: 'Climate Tech Innovations',
      channel: 'EcoFuture',
      channelId: 'ecofuture',
      status: 'scheduled',
      progress: 100,
      dueDate: '2024-01-25'
    },
    {
      id: '5',
      title: 'Cryptocurrency Trends 2024',
      channel: 'CryptoInsights',
      channelId: 'cryptoinsights',
      status: 'published',
      progress: 100,
      views: 125000,
      likes: 8900,
      comments: 456
    },
  ];

  const getVideosByStatus = (status: string) => {
    return videos.filter(video => video.status === status);
  };

  const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
    <div className="kanban-card">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{video.title}</h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">{video.channel}</p>
      
      {video.dueDate && (
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          {video.dueDate}
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-1.5 mb-3">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${video.progress}%` }}
        />
      </div>
      
      {video.status === 'review' && (
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1 h-8 text-xs">
            <Check className="h-3 w-3 mr-1" />
            Approve
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {video.status === 'published' && video.views && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.views.toLocaleString()} views</span>
          <span>{video.likes?.toLocaleString()} likes</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Studio</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-remix"
              checked={autoRemixEnabled}
              onCheckedChange={setAutoRemixEnabled}
            />
            <Label htmlFor="auto-remix" className="flex items-center">
              <Shuffle className="h-4 w-4 mr-1" />
              Automated Content Remixing
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 min-h-[600px]">
        {columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color} mr-2`} />
              <h3 className="font-medium text-sm">{column.title}</h3>
              <Badge variant="outline" className="ml-2 text-xs">
                {getVideosByStatus(column.id).length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {getVideosByStatus(column.id).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentStudio;
