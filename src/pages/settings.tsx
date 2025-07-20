import React from 'react';
import { withAuth } from './_app';

function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Application settings and preferences will go here.</p>
    </div>
  );
}

export default withAuth(SettingsPage); 