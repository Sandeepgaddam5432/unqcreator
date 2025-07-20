import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateUser, getUserData } from '@/lib/googleSheetDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed for this endpoint'
    });
  }

  try {
    // Get and validate the current session
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'You must be logged in to update your Colab URL'
      });
    }

    // Validate request body
    const { colab_url } = req.body;
    if (!colab_url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field',
        message: 'Colab URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(colab_url);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
        message: 'The URL provided is not valid. Please enter a complete URL (e.g., https://example.com)'
      });
    }
    
    // Ensure URL is not too long
    if (colab_url.length > 2048) {
      return res.status(400).json({
        success: false,
        error: 'URL too long',
        message: 'The URL provided exceeds the maximum length of 2048 characters'
      });
    }

    // Update the user's data with the new Colab URL
    const updatedUser = await updateUser(session.user.email, {
      colab_url: colab_url
    });

    if (!updatedUser) {
      throw new Error('Failed to update user data');
    }

    // Get the complete user data to return
    const fullUserData = await getUserData(session.user.email);

    if (!fullUserData) {
      throw new Error('Failed to retrieve updated user data');
    }

    // Log successful update
    console.log(`Colab URL updated for ${session.user.email}: ${colab_url.substring(0, 20)}...`);

    // Return the updated user data
    return res.status(200).json({ 
      success: true, 
      message: 'Colab URL updated successfully',
      user: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        colab_url: updatedUser.colab_url,
        secondary_accounts: updatedUser.secondary_accounts || []
      }
    });
  } catch (error: any) {
    // Detailed error logging
    console.error('Error updating Colab URL:', {
      message: error.message,
      stack: error.stack,
      error
    });

    // Return appropriate error response
    return res.status(500).json({ 
      success: false,
      error: 'Server error', 
      message: 'Failed to update Colab URL. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 