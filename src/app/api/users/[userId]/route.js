import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


const prisma = new PrismaClient();

export async function PUT(req, { params }) {

  try {
    const session = await getServerSession(authOptions);

    const { userId } = params;
    const { role } = await req.json();

    // Validate the role (optional, you can expand this)
    if (!["CLIENT", "ADMIN"].includes(role)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400 }
      );
    }

    // Check if the current user is a superadmin
    if (session.user.role !== "SUPERADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "You are not authorized to modify user roles" }),
        { status: 403 }
      );
    }

    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
    });

    return new NextResponse(
      JSON.stringify({ message: "User role updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Server error", message: error.message }),
      { status: 500 }
    );
  }
}
