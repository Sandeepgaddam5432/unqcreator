import "next-auth"
import "next-auth/jwt"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      colab_url?: string;
      secondary_accounts?: Array<{ email: string }>;
    }
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
} 