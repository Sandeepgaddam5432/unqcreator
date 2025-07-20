import React from 'react';
import SettingsComponent from '@/pages/Settings';
import { withAuth } from './_app';

function SettingsPage() {
  return <SettingsComponent />;
}

export default withAuth(SettingsPage); 