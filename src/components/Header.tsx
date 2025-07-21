
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const logout = () => signOut({ callbackUrl: '/' });
  const [hasNotifications] = useState(true);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, videos, or channels..."
              className="pl-10 bg-muted/50 border-0 focus:bg-muted"
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-card border-b border-border md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, videos, or channels..."
              className="pl-10 bg-muted/50 border-0 focus:bg-muted"
            />
          </div>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs">
              3
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 md:space-x-3 h-10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/channels" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                Manage Connected Channels
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
