import React from 'react';
import { withAuth } from '@/lib/withAuth';

function ChannelsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Channels</h1>
      <p>Channels management content will go here.</p>
    </div>
  );
}

export default withAuth(ChannelsPage); 