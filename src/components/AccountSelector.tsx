import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccountSelectorProps {
  onAddAccount: () => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ onAddAccount }) => {
  const { user, secondaryAccounts, selectedAccount, setSelectedAccount } = useAuth();

  if (!user) return null;
  
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span className="max-w-[150px] truncate">
              {selectedAccount || user.email}
            </span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
          
          {/* Main account */}
          <DropdownMenuItem 
            onClick={() => setSelectedAccount(user.email)}
            className={selectedAccount === user.email ? 'bg-muted' : ''}
          >
            <User className="mr-2 h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </DropdownMenuItem>
          
          {/* Secondary accounts */}
          {secondaryAccounts.map((account) => (
            <DropdownMenuItem
              key={account.email}
              onClick={() => setSelectedAccount(account.email)}
              className={selectedAccount === account.email ? 'bg-muted' : ''}
            >
              <User className="mr-2 h-4 w-4" />
              <span className="truncate">{account.email}</span>
            </DropdownMenuItem>
          ))}
          
          {/* Add account option */}
          <DropdownMenuItem onClick={onAddAccount}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountSelector; 