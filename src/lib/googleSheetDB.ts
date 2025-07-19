import { google } from 'googleapis';
import CryptoJS from 'crypto-js';

// Encryption key should come from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key';

// Service account credentials should be stored securely
const getServiceAccountAuth = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
};

// Google Sheet ID from environment variables
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Users'; // The name of the sheet tab

// Encrypt sensitive data
const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

// Decrypt sensitive data
const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Find a user by email
export const findUserByEmail = async (email: string) => {
  const auth = getServiceAccountAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
    });

    const rows = response.data.values || [];
    // Skip the header row and find the user by email
    const userRow = rows.slice(1).find(row => row[0] === email);
    
    if (!userRow) return null;

    return {
      main_user_email: userRow[0],
      colab_url: userRow[1],
      encrypted_main_token: userRow[2],
      secondary_accounts_json: userRow[3] ? JSON.parse(userRow[3]) : []
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: {
  main_user_email: string;
  colab_url: string;
  access_token: string;
  refresh_token: string;
}) => {
  const auth = getServiceAccountAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const encryptedToken = encrypt(JSON.stringify({
    access_token: userData.access_token,
    refresh_token: userData.refresh_token
  }));

  try {
    // First check if user already exists
    const existingUser = await findUserByEmail(userData.main_user_email);
    if (existingUser) {
      // Update existing user instead
      return updateUser(userData.main_user_email, {
        colab_url: userData.colab_url,
        main_token: { access_token: userData.access_token, refresh_token: userData.refresh_token }
      });
    }

    // Add new user
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            userData.main_user_email,
            userData.colab_url,
            encryptedToken,
            JSON.stringify([]) // Empty array for secondary accounts
          ]
        ]
      }
    });

    return {
      main_user_email: userData.main_user_email,
      colab_url: userData.colab_url
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update a user's data
export const updateUser = async (email: string, dataToUpdate: {
  colab_url?: string;
  main_token?: { access_token: string; refresh_token: string };
  secondary_account?: { 
    email: string;
    access_token: string;
    refresh_token: string;
    scopes: string[];
  };
}) => {
  const auth = getServiceAccountAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Get the current user data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
    });

    const rows = response.data.values || [];
    // Find the row index for this user
    const rowIndex = rows.findIndex(row => row[0] === email);
    
    if (rowIndex === -1) {
      throw new Error('User not found');
    }

    // Get the current values
    const currentRow = rows[rowIndex];
    let updatedRow = [...currentRow];

    // Update colab_url if provided
    if (dataToUpdate.colab_url) {
      updatedRow[1] = dataToUpdate.colab_url;
    }

    // Update main token if provided
    if (dataToUpdate.main_token) {
      updatedRow[2] = encrypt(JSON.stringify(dataToUpdate.main_token));
    }

    // Update secondary accounts if provided
    if (dataToUpdate.secondary_account) {
      const currentAccounts = currentRow[3] ? JSON.parse(currentRow[3]) : [];
      const encryptedAccount = {
        email: dataToUpdate.secondary_account.email,
        encrypted_token: encrypt(JSON.stringify({
          access_token: dataToUpdate.secondary_account.access_token,
          refresh_token: dataToUpdate.secondary_account.refresh_token,
          scopes: dataToUpdate.secondary_account.scopes
        }))
      };
      
      // Check if this secondary account already exists
      const existingIndex = currentAccounts.findIndex(
        (acc: any) => acc.email === dataToUpdate.secondary_account!.email
      );
      
      if (existingIndex >= 0) {
        // Update existing secondary account
        currentAccounts[existingIndex] = encryptedAccount;
      } else {
        // Add new secondary account
        currentAccounts.push(encryptedAccount);
      }
      
      updatedRow[3] = JSON.stringify(currentAccounts);
    }

    // Update the row in the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:D${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [updatedRow]
      }
    });

    return {
      main_user_email: email,
      colab_url: updatedRow[1],
      secondary_accounts: updatedRow[3] ? JSON.parse(updatedRow[3]).map((acc: any) => ({ email: acc.email })) : []
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get user data including decrypted tokens
export const getUserData = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  try {
    // Decrypt the main token
    const mainToken = user.encrypted_main_token ? 
      JSON.parse(decrypt(user.encrypted_main_token)) : null;

    // Decrypt secondary accounts tokens
    const secondaryAccounts = user.secondary_accounts_json ? 
      user.secondary_accounts_json.map((account: any) => ({
        email: account.email,
        token: JSON.parse(decrypt(account.encrypted_token))
      })) : [];

    return {
      main_user_email: user.main_user_email,
      colab_url: user.colab_url,
      main_token: mainToken,
      secondary_accounts: secondaryAccounts
    };
  } catch (error) {
    console.error('Error decrypting user data:', error);
    throw error;
  }
}; 