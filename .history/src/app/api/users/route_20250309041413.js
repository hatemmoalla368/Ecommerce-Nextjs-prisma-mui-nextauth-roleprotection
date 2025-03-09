import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    }

    // Fetch users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        adresse:true
      },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error", message: error.message }), { status: 500 });
  }
}
