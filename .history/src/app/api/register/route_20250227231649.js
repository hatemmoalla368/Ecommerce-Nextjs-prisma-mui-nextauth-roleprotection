import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";  // Import crypto module
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { firstname, lastname, email, password, adresse } = await req.json();

    // Validate required fields
    if (!firstname || !lastname || !email || !password || !adresse) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email already in use" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        adresse,
        role: "CLIENT",
        isActive: false,
        verificationToken,
      },
    });

     
    await sendVerificationEmail(email, verificationToken);

    
    return new Response(
      JSON.stringify({
        message: "User registered. Check your email to verify your account.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error", message: error.message }),
      { status: 500 }
    );
  }
}

 
async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hatemmoalla368@gmail.com",
      pass: "ljac eqly wbxc gtpt",  
    },
  });

  const verificationLink = `http://localhost:3000/api/auth/verify?token=${token}`;


  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
}
