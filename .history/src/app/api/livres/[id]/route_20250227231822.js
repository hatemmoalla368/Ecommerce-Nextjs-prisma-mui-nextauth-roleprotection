import { PrismaClient } from '@prisma/client'; 
import { getSession } from 'next-auth/react';
import { NextResponse } from "next/server"; 
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
 
const prisma = new PrismaClient(); 
 
export const GET=async(req,{params})=> { 
  try { 
 
    const id=parseInt(params.id) 
   const result =await prisma.livres.findUnique({ 
      where:{ 
         id 
      }, 
      include: { 
        specialites: { 
          select: { 
            id : true, 
            nomspecialite: true, 
          }, 
        }, 
        editeurs: { 
          select: { 
            id : true, 
            maisonedit: true, 
          }, 
        }, 
        livre_auteur: { 
          include: { 
            auteurs: { 
              select: { 
                id : true, 
                nomauteur: true, 
              }, 
            } 
          } 
        } 
          }  
      
    }); 
    return  NextResponse.json( result) 
    
  } catch (error) { 
          console.log(error) 
    } 
 
    
  } 
  export async function PUT(req, { params }) {
    try {
      const { id } = params;
      console.log("Request ID:", id);
  
      // Parse the request body
      const body = await req.json();
      console.log("Request body:", body);
  
      const { isbn, titre, annedition, prix, qtestock, couverture, specialite_id, editeur_id, auteurs } = body;
  
      // Validate required fields
      if (!isbn || !titre || !auteurs) {
        return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
      }
  
      // Ensure auteurs is an array and contains valid auteur_id values
      if (!Array.isArray(auteurs) || auteurs.some(a => !a.auteur_id)) {
        return new Response(JSON.stringify({ message: "Invalid auteurs data" }), { status: 400 });
      }
  
      // Check if the provided auteur_id values exist in the auteurs table
      const existingAuteurs = await prisma.auteurs.findMany({
        where: {
          id: { in: auteurs.map(a => Number(a.auteur_id)) },
        },
      });
  
      if (existingAuteurs.length !== auteurs.length) {
        return new Response(JSON.stringify({ message: "One or more auteur_id values are invalid" }), { status: 400 });
      }
  
      // Log the data being passed to Prisma
      console.log("Data being passed to Prisma:", {
        isbn,
        titre,
        annedition,
        prix,
        qtestock,
        couverture,
        specialite_id,
        editeur_id,
        auteurs,
      });
  
      // Update the book and its many-to-many relationship
      const updatedLivre = await prisma.livres.update({
        where: { id: Number(id) },
        data: {
          isbn,
          titre,
          annedition: Number(annedition),
          prix: Number(prix),
          qtestock: Number(qtestock),
          couverture,
          specialite_id: Number(specialite_id),
          editeur_id: Number(editeur_id),
          livre_auteur: {
            deleteMany: {}, // Remove old authors
            create: auteurs.map(a => ({ auteur_id: Number(a.auteur_id) })), // Add new authors
          },
        },
        include: { livre_auteur: true },
      });
  
      console.log("Updated livre:", updatedLivre);
  
      return new Response(JSON.stringify(updatedLivre), { status: 200 });
    } catch (error) {
      console.error("Error updating book:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
  }
 


export const DELETE = async (req, context) => {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and has the ADMIN role
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource." });
  }
  try {
    // Await params to retrieve the dynamic parameter
    const { id } = await context.params;

    // Parse the ID
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
    }

    // Check if the livre exists before trying to delete
    const livre = await prisma.livres.findUnique({
      where: { id: parsedId },
    });

    if (!livre) {
      return NextResponse.json({ error: 'Livre not found' }, { status: 404 });
    }

    // First, delete the livre_auteur associations
    await prisma.livre_auteur.deleteMany({
      where: {
        livre_id: parsedId,
      },
    });

     
    await prisma.livres.delete({
      where: {
        id: parsedId,
      },
    });

    return NextResponse.json({ message: 'Livre deleted successfully' });

  } catch (error) {
    console.error('Error deleting livre:', error);
    return NextResponse.json({ error: 'Failed to delete livre' }, { status: 500 });
  }
};
