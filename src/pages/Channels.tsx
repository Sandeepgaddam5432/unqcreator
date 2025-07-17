
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Settings, 
  Users, 
  Youtube, 
  Instagram,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Channel } from '../types';

const Channels = () => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'TechExplainer',
      platform: 'youtube',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face',
      subscribers: 125000,
      isZeroTouchEnabled: true,
      status: 'healthy',
      brandVoice: 'Educational, friendly, and engaging tech content'
    },
    {
      id: '2',
      name: 'FutureThoughts',
      platform: 'youtube',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      subscribers: 89000,
      isZeroTouchEnabled: false,
      status: 'warning',
      brandVoice: 'Thought-provoking discussions about technology and society'
    },
    {
      id: '3',
      name: 'TechDaily',
      platform: 'instagram',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      subscribers: 45000,
      isZeroTouchEnabled: true,
      status: 'healthy',
      brandVoice: 'Quick tech tips and news in visual format'
    },
    {
      id: '4',
      name: 'AIInsights',
      platform: 'youtube',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9723db2?w=100&h=100&fit=crop&crop=face',
      subscribers: 67000,
      isZeroTouchEnabled: false,
      status: 'error',
      brandVoice: 'Deep dives into artificial intelligence and machine learning'
    },
  ]);

  const toggleZeroTouch = (channelId: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.id === channelId
          ? { ...channel, isZeroTouchEnabled: !channel.isZeroTouchEnabled }
          : channel
      )
    );
  };

  const getStatusIcon = (status: Channel['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'youtube' ? (
      <Youtube className="h-5 w-5 text-red-500" />
    ) : (
      <Instagram className="h-5 w-5 text-pink-500" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Channel Management</h1>
          <p className="text-muted-foreground">Manage your connected YouTube and Instagram channels</p>
        </div>
        <Button size="lg" className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Add New Channel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Channels</p>
                <p className="text-2xl font-bold">{channels.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zero-Touch Enabled</p>
                <p className="text-2xl font-bold">
                  {channels.filter(c => c.isZeroTouchEnabled).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">
                  {channels.reduce((sum, channel) => sum + channel.subscribers, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Channels</p>
                <p className="text-2xl font-bold">
                  {channels.filter(c => c.status === 'healthy').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className="glass-card">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={channel.avatar} alt={channel.name} />
                    <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{channel.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(channel.platform)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {channel.platform}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(channel.status)}
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {channel.platform === 'youtube' ? 'Subscribers' : 'Followers'}
                  </span>
                  <span className="font-medium">{channel.subscribers.toLocaleString()}</span>
                </div>
              </div>

              {/* Zero-Touch Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-4">
                <div>
                  <Label htmlFor={`zero-touch-${channel.id}`} className="text-sm font-medium">
                    Zero-Touch Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    AI manages this channel autonomously
                  </p>
                </div>
                <Switch
                  id={`zero-touch-${channel.id}`}
                  checked={channel.isZeroTouchEnabled}
                  onCheckedChange={() => toggleZeroTouch(channel.id)}
                />
              </div>

              {/* Brand Voice */}
              <div className="mb-4">
                <Label className="text-sm font-medium">Brand Voice</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {channel.brandVoice}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge variant={
                  channel.status === 'healthy' ? 'default' :
                  channel.status === 'warning' ? 'secondary' : 'destructive'
                }>
                  {channel.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Edit Brand Voice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Channels;
