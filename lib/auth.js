import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration.
 * Uses DummyJSON's auth endpoint as the credentials provider.
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://dummyjson.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            expiresInMins: 60,
          }),
        });
        const data = await res.json();

        if (res.ok && data.accessToken) {
          return {
            id: String(data.id),
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            image: data.image,
            username: data.username,
            token: data.accessToken,
            refreshToken: data.refreshToken,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Persist token and user data into the JWT on first sign-in
      if (user) {
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.userData = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose accessToken and full user data to the client session
      session.accessToken = token.accessToken;
      session.user = token.userData;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
};
