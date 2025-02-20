// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../lib/db'; // We'll implement this later
//import { User } from '../../../types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Invalid credentials'); // Throw an error for NextAuth to handle
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password!); // Assuming password is not optional after registration

        if (!passwordMatch) {
          throw new Error('Invalid password');
        }

        // Return the user object.  NextAuth will handle creating the session.
        return { id: user._id.toString(), email: user.email, name: user.name }; // Return essential user data
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Use an environment variable for the secret
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID to the token right after signin
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page
    // error: '/auth/error', // You can create a custom error page if needed
  },
};

export default NextAuth(authOptions);