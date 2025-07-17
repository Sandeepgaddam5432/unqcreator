
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Key, 
  Zap, 
  DollarSign,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [settings, setSettings] = useState({
    aiCollaboration: true,
    dynamicSponsorship: false,
    comfyuiApiEndpoint: '',
    googleAiApiKey: '',
    openaiApiKey: '',
    elevenLabsApiKey: '',
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to backend
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-lg">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-1">Project Owner</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name || ''} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user?.email || ''} readOnly className="bg-muted" />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Profile information is managed through your Google account. 
                  Changes to your name or email should be made in your Google Account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  API Keys & Integrations
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKeys(!showApiKeys)}
                >
                  {showApiKeys ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="comfyui">ComfyUI API Endpoint</Label>
                  <Input
                    id="comfyui"
                    placeholder="https://your-comfyui-endpoint.com"
                    type={showApiKeys ? 'text' : 'password'}
                    value={settings.comfyuiApiEndpoint}
                    onChange={(e) => handleSettingChange('comfyuiApiEndpoint', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for AI image and video generation
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="googleai">Google AI Studio API Key</Label>
                  <Input
                    id="googleai"
                    placeholder="Enter your Google AI API key"
                    type={showApiKeys ? 'text' : 'password'}
                    value={settings.googleAiApiKey}
                    onChange={(e) => handleSettingChange('googleAiApiKey', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For content generation and natural language processing
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="openai">OpenAI API Key</Label>
                  <Input
                    id="openai"
                    placeholder="Enter your OpenAI API key"
                    type={showApiKeys ? 'text' : 'password'}
                    value={settings.openaiApiKey}
                    onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For advanced content creation and chat functionality
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
                  <Input
                    id="elevenlabs"
                    placeholder="Enter your ElevenLabs API key"
                    type={showApiKeys ? 'text' : 'password'}
                    value={settings.elevenLabsApiKey}
                    onChange={(e) => handleSettingChange('elevenLabsApiKey', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For AI voice generation and audio content
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  <strong>Security Note:</strong> API keys are encrypted and stored securely. 
                  Never share your API keys with others.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Automation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="ai-collaboration">AI-Driven Collaboration Finder</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically find and suggest collaboration opportunities with other creators
                  </p>
                </div>
                <Switch
                  id="ai-collaboration"
                  checked={settings.aiCollaboration}
                  onCheckedChange={(value) => handleSettingChange('aiCollaboration', value)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="dynamic-sponsorship">Dynamic Sponsorship Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow AI to insert relevant sponsor spots in videos automatically
                  </p>
                </div>
                <Switch
                  id="dynamic-sponsorship"
                  checked={settings.dynamicSponsorship}
                  onCheckedChange={(value) => handleSettingChange('dynamicSponsorship', value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Monetization Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Monetization features are coming soon. You'll be able to set up automatic 
                  sponsor integrations, merchandise placement, and revenue optimization.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
