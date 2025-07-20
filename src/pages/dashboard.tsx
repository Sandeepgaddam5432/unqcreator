import React from 'react';
import DashboardComponent from '@/components/Dashboard';
import { withAuth } from './_app';

function DashboardPage() {
  return <DashboardComponent />;
}

export default withAuth(DashboardPage); 