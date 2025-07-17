
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
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onMobileToggle }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wand2, label: 'Content Studio', path: '/content-studio' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Grid3X3, label: 'Channels', path: '/channels' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden md:flex h-full bg-card border-r border-border transition-all duration-300 flex-col',
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

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 md:hidden flex flex-col',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
            <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              UnQCreator
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path} onClick={() => onMobileToggle()}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start h-12 px-4"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
