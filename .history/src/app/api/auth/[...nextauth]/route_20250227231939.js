import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    // ✅ Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("All fields are required");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }
        if (!user.isActive) {
          return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // Compare passwords
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, name: `${user.firstname} ${user.lastname}`, email: user.email, role: user.role, adresse:user.adresse, isActive:user.isActive };
      },
    }),

    // ✅ Google Login
    GoogleProvider({  

        clientId: "628099699298-ksrjkqvurvf0qbghbgtr60a91d3r8kbj.apps.googleusercontent.com",  

        clientSecret: "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"  

    }),

     
    GitHubProvider({  

        clientId: "4779b936bcc7953670e5",  

        clientSecret: "c594f90fd3c91a1a0e23f3a9df0216b4985303c4",  

      }),  
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
         
        const nameParts = user.name?.split(" ") || ["", ""];
        const firstname = nameParts[0] || "Unknown";
        const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  
         
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
  
         
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              firstname,
              lastname,
              email: user.email,
              role: "CLIENT",  
              isActive: true,  
              adresse: "",  
            },
          });
        }
  
         
        token.id = existingUser.id;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isActive = existingUser.isActive;
        token.adresse = existingUser.adresse;  
      } else {
         
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
  
        if (dbUser) {
          token.adresse = dbUser.adresse;  
        }
      }
  
      return token;
    },
  
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.isActive = token.isActive;
      session.user.adresse = token.adresse;  
  
      return session;
    },
  },
  
  
  pages: {
    signIn: "/login",  
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
