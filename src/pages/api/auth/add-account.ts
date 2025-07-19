import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { google } from 'googleapis';
import { updateUser } from '@/lib/googleSheetDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the session to verify the user is authenticated
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange the code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/dashboard`
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Get the email of the secondary account
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    
    const userInfo = await oauth2.userinfo.get();
    const secondaryEmail = userInfo.data.email;

    if (!secondaryEmail) {
      return res.status(400).json({ error: 'Could not retrieve secondary account email' });
    }

    // Update the user's data with the new secondary account
    await updateUser(session.user.email, {
      secondary_account: {
        email: secondaryEmail,
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!,
        scopes: tokens.scope!.split(' ')
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Secondary account added successfully',
      account: {
        email: secondaryEmail
      }
    });
  } catch (error: any) {
    console.error('Error adding secondary account:', error);
    return res.status(500).json({ 
      error: 'Failed to add secondary account', 
      details: error.message 
    });
  }
} 