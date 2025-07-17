
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Wand2, 
  BarChart3, 
  Grid3X3, 
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wand2, label: 'Content Studio', path: '/content-studio' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Grid3X3, label: 'Channels', path: '/channels' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={cn(
      'h-full bg-card border-r border-border transition-all duration-300 flex flex-col',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
          {!collapsed && (
            <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              UnQCreator
            </h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  'w-full justify-start h-12',
                  collapsed && 'px-3',
                  !collapsed && 'px-4'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
