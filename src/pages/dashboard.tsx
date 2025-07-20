import React from 'react';
import DashboardComponent from '@/components/Dashboard';
import Layout from '@/components/Layout';

function DashboardPage() {
  return (
    <DashboardComponent />
  );
}

// The _app.tsx file handles auth protection already
export default DashboardPage; 