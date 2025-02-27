import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Verification token is missing" }),
        { status: 400 }
      );
    }

    // Find the user with the provided verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    // Update the user's status to active and clear the verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, verificationToken: null },
    });

    return new NextResponse(
      JSON.stringify({ message: "Your account has been activated!" }),
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
