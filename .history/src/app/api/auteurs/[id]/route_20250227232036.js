import { PrismaClient } from '@prisma/client'; 
import { getSession } from 'next-auth/react';
import { NextResponse } from "next/server"; 
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
 
const prisma = new PrismaClient(); 
 
export const GET=async(req,{params})=> { 
  try { 
 
    const id=  parseInt(params.id)
  
   const result =await prisma.auteurs.findUnique({ 
      where:{ 
         id 
      }, 
      select:{
        id:true,
        nomauteur: true,
        email:true,
        numtel:true

      }
      
    }); 
    return  NextResponse.json( result) 
    
  } catch (error) { 
          console.log(error) 
    } 
 
    
  } 
    
  export async function PUT(req, { params }) {
    try {
      // Extract the ID from params
      const { id } = params;
      console.log('Request ID:', id);
  
      // Parse the request body
      const body = await req.json();
      console.log('Request body:', body);
  
      const { nomauteur, email, numtel } = body;
  
      // Validate required fields
      if (!nomauteur || !email || !numtel) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }
  
      // Check if the auteur exists
      const existingAuteur = await prisma.auteurs.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existingAuteur) {
        return NextResponse.json(
          { message: 'Auteur not found' },
          { status: 404 }
        );
      }
  
       
      if (email !== existingAuteur.email) {
        const emailExists = await prisma.auteurs.findUnique({
          where: { email },
        });
  
        if (emailExists) {
          return NextResponse.json(
            { message: 'Email already exists for another auteur' },
            { status: 400 }
          );
        }
      }
  
       
      ('Updating auteur with data:', {
        nomauteur,
        email,
        numtel ,
      });
  
       
      const updatedAuteur = await prisma.auteurs.update({
        where: { id: Number(id) },
        data: {
          nomauteur,
          email,
          numtel,  
        },
      });
  
      ('Updated auteur:', updatedAuteur);
  
      return NextResponse.json(updatedAuteur, { status: 200 });
    } catch (error) {
      console.error('Error updating auteur:', error);
      return NextResponse.json(
        { message: 'Internal Server Error', error: { name: error.name, clientVersion: error.clientVersion } },
        { status: 500 }
      );
    }
  }
 


export const DELETE = async (req, context) => {
  const session = await getServerSession(authOptions);

  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource." });
  }
  try {
     
    const { id } = await context.params;
('the id', id)
     
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
    }

     
    const auteur = await prisma.auteurs.findUnique({
      where: { id: parsedId },
    });
('the auteur to delete', auteur)
    if (!auteur) {
      return NextResponse.json({ error: 'auteur not found' }, { status: 404 });
    }
    await prisma.livre_auteur.deleteMany({
        where: {
        auteur_id: parsedId,
        },
      });
   

     
    await prisma.auteurs.delete({
      where: {
        id: parsedId,
      },
    });

    return NextResponse.json({ message: 'auteur deleted successfully' });

  } catch (error) {
    console.error('Error deleting auteur:', error);
    return NextResponse.json({ error: 'Failed to delete auteur' }, { status: 500 });
  }
};
