import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-6">
        <AlertTriangle size={64} className="text-yellow-500 mx-auto" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
} 