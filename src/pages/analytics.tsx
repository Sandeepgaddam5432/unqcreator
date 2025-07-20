import React from 'react';
import AnalyticsComponent from '@/pages/Analytics';
import { withAuth } from './_app';

function AnalyticsPage() {
  return <AnalyticsComponent />;
}

export default withAuth(AnalyticsPage); 