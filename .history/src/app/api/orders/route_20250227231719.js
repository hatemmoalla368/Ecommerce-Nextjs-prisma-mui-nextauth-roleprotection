// src/app/api/orders/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { items, total, adresse } = await request.json();

  try {
    const userad = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userad.adresse) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { adresse },
      });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        adresse,
        total: total,
        items: {
          create: items.map((item) => ({
            livreId: item.id,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/*export async function GET(request) {
    const session = await getServerSession(authOptions);
  
    /*if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
      }
    
    const orders = await prisma.order.findMany({
        include: { 
            user: { 
              select: { 
                id : true, 
                email: true,
                adresse:true,
                firstname: true, 
                lastname: true, 

              }, 
            }, 
            
            items: { 
              include: { 
                livre: { 
                  select: { 
                    id : true, 
                    titre: true, 
                    couverture: true,
                  }, 
                } 
              } 
            } 
              }  
    })  
    return NextResponse.json(
        { message: "Order created successfully", orders },
        { status: 201 }
      );
}*/

export async function GET(request) {
    const session = await getServerSession(authOptions);
  
    // Check if the user is an admin or superadmin
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: true, // Include user details
          items: {
            include: {
              livre: true, // Include livre details
            },
          },
        },
        orderBy: {
          createdAt: "desc",  
        },
      });
  
      return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return NextResponse.json(
        { message: "Failed to fetch orders" },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }