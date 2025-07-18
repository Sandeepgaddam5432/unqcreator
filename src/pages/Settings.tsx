
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
  EyeOff,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Play
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { AVAILABLE_VOICES, getTtsService } from '@/services/TtsService';
import { toast } from '@/components/ui/use-toast';

const TtsSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [testText, setTestText] = useState("This is a test of the text-to-speech system.");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTest = async () => {
    if (!settings.googleTtsApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google TTS API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    try {
      const ttsService = getTtsService(settings.googleTtsApiKey);
      await ttsService.synthesizeAndPlay(testText, {
        voice: settings.ttsVoice,
        speed: settings.ttsSpeed,
        pitch: settings.ttsPitch
      });
    } catch (error) {
      console.error('TTS test error:', error);
      toast({
        title: "TTS Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="mr-2 h-5 w-5" />
          Text-to-Speech Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="googleTtsApiKey">Google TTS API Key</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
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
            </div>
            <Input
              id="googleTtsApiKey"
              type={showApiKey ? 'text' : 'password'}
              value={settings.googleTtsApiKey}
              onChange={(e) => updateSettings({ googleTtsApiKey: e.target.value })}
              placeholder="Enter your Google TTS API key"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Used for high-quality text-to-speech in video generation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ttsVoice">Voice</Label>
            <Select
              value={settings.ttsVoice}
              onValueChange={(value) => updateSettings({ ttsVoice: value })}
            >
              <SelectTrigger id="ttsVoice">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name} ({voice.language}) - {voice.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ttsSpeed">Speed: {settings.ttsSpeed.toFixed(1)}x</Label>
            </div>
            <Slider
              id="ttsSpeed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[settings.ttsSpeed]}
              onValueChange={(value) => updateSettings({ ttsSpeed: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ttsPitch">Pitch: {settings.ttsPitch}</Label>
            </div>
            <Slider
              id="ttsPitch"
              min={-10}
              max={10}
              step={1}
              value={[settings.ttsPitch]}
              onValueChange={(value) => updateSettings({ ttsPitch: value[0] })}
            />
          </div>

          <div className="pt-4">
            <div className="space-y-2">
              <Label htmlFor="testTts">Test Text-to-Speech</Label>
              <div className="flex space-x-2">
                <Input
                  id="testTts"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to test TTS"
                />
                <Button
                  variant="secondary"
                  onClick={handlePlayTest}
                  disabled={isPlaying || !settings.googleTtsApiKey}
                >
                  {isPlaying ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Note:</strong> You'll need a Google Cloud Platform API key with the Text-to-Speech API enabled.
            Visit the <a href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a> to set this up.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { 
    apiEndpoint, 
    connectionStatus, 
    connectionError, 
    lastHeartbeat, 
    resetConfiguration,
    checkConnection
  } = useOnboarding();
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    updateSettings({ [key]: value });
  };

  const handleConnectionCheck = async () => {
    setIsCheckingConnection(true);
    try {
      await checkConnection();
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleResetConnection = () => {
    if (window.confirm('Are you sure you want to reset your API connection? You will need to reconfigure it.')) {
      resetConfiguration();
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Connected
          </div>
        );
      case 'validating':
        return (
          <div className="flex items-center text-blue-500">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Checking...
          </div>
        );
      case 'error':
      case 'timeout':
      case 'cors_error':
      case 'invalid_url':
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            Error: {connectionError?.message || 'Unknown error'}
          </div>
        );
      default:
        return (
          <div className="flex items-center text-amber-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            Not configured
          </div>
        );
    }
  };

  const handleSave = () => {
    console.log('Settings saved!');
    // Show a toast or confirmation message here
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
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                UnQCreator Engine Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label>Connection Status</Label>
                    <div className="mt-1">
                      {getConnectionStatusDisplay()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConnectionCheck}
                    disabled={isCheckingConnection || !apiEndpoint}
                  >
                    {isCheckingConnection ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Check Connection
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input
                    value={apiEndpoint || ''}
                    readOnly
                    className="bg-muted font-mono text-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      Last heartbeat: {formatDate(lastHeartbeat)}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleResetConnection}
                    >
                      Reset Connection
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <TtsSettings />

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
