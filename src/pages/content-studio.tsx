import React from 'react';
import ContentStudioComponent from '@/pages/ContentStudio';
import { withAuth } from './_app';

function ContentStudioPage() {
  return <ContentStudioComponent />;
}

export default withAuth(ContentStudioPage); 