
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const subscriberGrowthData = [
    { date: '2024-01-01', subscribers: 10000 },
    { date: '2024-01-02', subscribers: 10150 },
    { date: '2024-01-03', subscribers: 10300 },
    { date: '2024-01-04', subscribers: 10280 },
    { date: '2024-01-05', subscribers: 10500 },
    { date: '2024-01-06', subscribers: 10750 },
    { date: '2024-01-07', subscribers: 11000 },
  ];

  const viewsPerVideoData = [
    { title: 'AI Revolution', views: 125000 },
    { title: 'Quantum Computing', views: 89000 },
    { title: 'Mars Colony', views: 156000 },
    { title: 'Climate Tech', views: 67000 },
    { title: 'Crypto Trends', views: 234000 },
  ];

  const trafficSourcesData = [
    { name: 'YouTube Search', value: 45, color: '#FF6B6B' },
    { name: 'Suggested Videos', value: 30, color: '#4ECDC4' },
    { name: 'External', value: 15, color: '#45B7D1' },
    { name: 'Direct', value: 10, color: '#96CEB4' },
  ];

  const videosTableData = [
    {
      title: 'AI Revolution in Healthcare',
      channel: 'TechMed',
      views: 125000,
      likes: 8900,
      comments: 456,
      engagement: 8.2,
      publishDate: '2024-01-01'
    },
    {
      title: 'Quantum Computing Explained',
      channel: 'ScienceDaily',
      views: 89000,
      likes: 6200,
      comments: 234,
      engagement: 7.8,
      publishDate: '2024-01-02'
    },
    {
      title: 'Mars Colony Updates',
      channel: 'SpaceNews',
      views: 156000,
      likes: 12000,
      comments: 678,
      engagement: 9.1,
      publishDate: '2024-01-03'
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="techmed">TechMed</SelectItem>
              <SelectItem value="sciencedaily">ScienceDaily</SelectItem>
              <SelectItem value="spacenews">SpaceNews</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriber Growth */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subscriberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Views per Video */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Views per Video</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsPerVideoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="title" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Video Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2 hidden sm:table-cell">Channel</th>
                    <th className="text-left p-2">Views</th>
                    <th className="text-left p-2">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {videosTableData.map((video, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{video.channel}</p>
                        </div>
                      </td>
                      <td className="p-2 hidden sm:table-cell">
                        <p className="text-xs text-muted-foreground">{video.channel}</p>
                      </td>
                      <td className="p-2">{video.views.toLocaleString()}</td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {video.engagement}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
