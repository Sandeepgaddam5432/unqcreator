import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createUser, getUserData } from '@/lib/googleSheetDB';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // Store the user data in our Google Sheet database
        if (account.provider === 'google') {
          try {
            // Use temporary storage for colab URL that will be updated
            // after login when user provides it
            await createUser({
              main_user_email: user.email!,
              colab_url: '',
              access_token: account.access_token!,
              refresh_token: account.refresh_token!
            });
          } catch (error) {
            console.error('Error storing user data:', error);
          }
        }

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          provider: account.provider,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Only proceed if we have a valid session and user
      if (!session?.user || !token?.sub) {
        console.warn('Session callback called with invalid session or token', { 
          hasUser: !!session?.user, 
          hasSub: !!token?.sub 
        });
        return session;
      }

      try {
        // Always fetch fresh user data from Google Sheet database on each session request
        const userData = await getUserData(session.user.email!);
        
        if (!userData) {
          console.warn(`No user data found for email: ${session.user.email}`);
          // Initialize with empty values instead of returning early
          session.user.colab_url = '';
          session.user.secondary_accounts = [];
        } else {
          // Add all user data to the session for global access
          session.user.colab_url = userData.colab_url || '';
          
          // Add secondary accounts information if available
          if (userData.secondary_accounts && userData.secondary_accounts.length > 0) {
            session.user.secondary_accounts = userData.secondary_accounts.map(account => ({
              email: account.email
            }));
          } else {
            session.user.secondary_accounts = [];
          }
          
          // Debug log to help trace session hydration issues
          console.log(`Session hydrated for ${session.user.email}, colab_url: ${session.user.colab_url ? '[SET]' : '[EMPTY]'}`);
        }
      } catch (error) {
        // Detailed error logging to help debug issues
        console.error(`Error hydrating session for ${session.user.email}:`, error);
        
        // Initialize with empty values on error to avoid undefined issues
        session.user.colab_url = '';
        session.user.secondary_accounts = [];
      }
      
      // Add access token to session
      session.accessToken = token.accessToken;
      
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
}); 