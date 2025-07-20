import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateUser, getUserData } from '@/lib/googleSheetDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { colab_url } = req.body;
    if (!colab_url) {
      return res.status(400).json({ error: 'Colab URL is required' });
    }

    // Update the user's data with the new Colab URL
    const updatedUser = await updateUser(session.user.email, {
      colab_url: colab_url
    });

    // Get the complete user data to return
    const fullUserData = await getUserData(session.user.email);

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
    console.error('Error updating Colab URL:', error);
    return res.status(500).json({ 
      error: 'Failed to update Colab URL', 
      details: error.message 
    });
  }
} 