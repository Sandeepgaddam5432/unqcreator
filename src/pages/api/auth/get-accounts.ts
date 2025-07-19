import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { findUserByEmail } from '@/lib/googleSheetDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userData = await findUserByEmail(session.user.email);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract just the email from each secondary account
    const accounts = userData.secondary_accounts_json 
      ? userData.secondary_accounts_json.map((acc: any) => ({ 
          email: acc.email 
        }))
      : [];

    return res.status(200).json({ 
      success: true,
      accounts
    });
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch accounts', 
      details: error.message 
    });
  }
} 