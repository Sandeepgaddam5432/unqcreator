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
      if (session.user && token.sub) {
        // Get user data from Google Sheet database
        try {
          const userData = await getUserData(session.user.email!);
          if (userData) {
            // Add the colab URL to the session
            session.user.colab_url = userData.colab_url;
          }
        } catch (error) {
          console.error('Error getting user data for session:', error);
        }
      }
      
      // Add access token to session
      session.accessToken = token.accessToken;
      
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
}); 