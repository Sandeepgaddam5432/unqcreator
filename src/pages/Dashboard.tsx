
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Video, 
  Heart,
  Sparkles,
  Play,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ApiError } from '@/services/ApiService';

const Dashboard = () => {
  const [masterPrompt, setMasterPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { settings } = useSettings();
  const { api } = useOnboarding();
  const { toast } = useToast();

  const stats = [
    { title: 'Total Views (24h)', value: '2.4M', change: '+12.5%', trend: 'up' },
    { title: 'New Subscribers (24h)', value: '1,247', change: '+8.2%', trend: 'up' },
    { title: 'Videos Published (Month)', value: '156', change: '+15.8%', trend: 'up' },
    { title: 'Engagement Rate', value: '8.9%', change: '-2.1%', trend: 'down' },
  ];

  const aiTasks = [
    { id: 1, title: 'The History of Rome', status: 'generating', progress: 65 },
    { id: 2, title: 'Top 5 AI Tools for 2024', status: 'review', progress: 100 },
    { id: 3, title: 'Mars Rover Explained', status: 'scheduled', progress: 100 },
  ];

  const topVideos = [
    { 
      title: 'Quantum Computing Breakthrough', 
      channel: 'TechExplainer', 
      views: '1.2M', 
      viralityScore: 92,
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120&h=68&fit=crop'
    },
    { 
      title: 'AI vs Human Creativity', 
      channel: 'FutureThoughts', 
      views: '890K', 
      viralityScore: 87,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=68&fit=crop'
    },
    { 
      title: 'Space Exploration 2024', 
      channel: 'CosmosDaily', 
      views: '756K', 
      viralityScore: 84,
      thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=120&h=68&fit=crop'
    },
  ];

  const channelHealth = [
    { name: 'TechExplainer', status: 'healthy', issue: null },
    { name: 'FutureThoughts', status: 'warning', issue: 'Low posting frequency' },
    { name: 'CosmosDaily', status: 'healthy', issue: null },
    { name: 'AIInsights', status: 'error', issue: 'Decreased viewership' },
  ];

  const handleGenerateContent = async () => {
    if (!masterPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (!api) {
      toast({
        title: "API Not Configured",
        description: "Please configure your UnQCreator Engine in the settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Basic prompt for a simple text-to-image generation
      const workflow = {
        "prompt": {
          "3": {
            "inputs": {
              "seed": 12345,
              "steps": 20,
              "cfg": 7,
              "sampler_name": "euler_a",
              "scheduler": "normal",
              "denoise": 1,
              "model": "model1",
              "positive": masterPrompt,
              "negative": "blurry, bad quality, worst quality",
              "latent_image": ["4", 0]
            },
            "class_type": "KSampler"
          },
          "4": {
            "inputs": {
              "width": 512,
              "height": 512,
              "batch_size": 1
            },
            "class_type": "EmptyLatentImage"
          }
        }
      };

      // Use our API service to submit the prompt
      const response = await api.submitPrompt(workflow);
      
      toast({
        title: "Content Generation Started",
        description: `Prompt ID: ${response.prompt_id}`,
        variant: "default",
      });

      console.log('Generation response:', response);
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Use our improved error handling
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Master Control */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Master Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              placeholder="Instruct your AI... (e.g., 'Create a 90-second video about quantum computing')"
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              className="flex-1 h-12 text-base md:text-lg"
            />
            <Button 
              onClick={handleGenerateContent}
              size="lg"
              className="px-8 w-full sm:w-auto"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Task Queue */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>AI Task Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{task.title}</h4>
                  <div className="flex items-center mt-2">
                    <div className="w-24 md:w-32 bg-muted rounded-full h-2 mr-3">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{task.progress}%</span>
                  </div>
                </div>
                <Badge variant={
                  task.status === 'generating' ? 'default' :
                  task.status === 'review' ? 'secondary' : 
                  'outline'
                } className="ml-2 shrink-0">
                  {task.status === 'generating' ? 'Generating' :
                   task.status === 'review' ? 'In Review' : 'Scheduled'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Videos */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top Performing Videos (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topVideos.map((video, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-12 h-7 md:w-16 md:h-9 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.channel}</p>
                  <p className="text-xs text-muted-foreground">{video.views} views</p>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 shrink-0 text-xs">
                  🔥 {video.viralityScore}/100
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Channel Health */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Channel Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channelHealth.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    channel.status === 'healthy' ? 'status-online' :
                    channel.status === 'warning' ? 'status-warning' : 'status-error'
                  }`} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{channel.name}</p>
                    {channel.issue && (
                      <p className="text-xs text-muted-foreground truncate">{channel.issue}</p>
                    )}
                  </div>
                </div>
                {channel.status !== 'healthy' && (
                  <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
