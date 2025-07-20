import React from 'react';
import ChannelsComponent from '@/pages/Channels';
import { withAuth } from './_app';

function ChannelsPage() {
  return <ChannelsComponent />;
}

export default withAuth(ChannelsPage); 