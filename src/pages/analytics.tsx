import React from 'react';
import { withAuth } from './_app';

function AnalyticsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p>Analytics dashboard content will go here.</p>
    </div>
  );
}

export default withAuth(AnalyticsPage); 