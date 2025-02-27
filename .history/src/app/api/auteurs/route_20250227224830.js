import { PrismaClient } from '@prisma/client'; 
import { NextResponse } from "next/server"; 
const prisma = new PrismaClient(); 

export const querylivpopulated=async()=>{
  try{
    const aut = await prisma.auteurs.findMany({
      select:{
        id:true,
        nomauteur:true,
        email: true,
        numtel : true,

      }

      
    })
    return aut
  }catch (error) { 
    (error) 
} 
finally{ 
    prisma.$disconnect() 
} 
}



export const QueryLiv=async()=>{ 
try { 
const listauteurs=await prisma.auteurs.findMany(); 
return listauteurs 
} catch (error) { 
(error) 
} 
finally{ 
prisma.$disconnect() 
} 
} 


export async function GET() {  

    const auteurs = await querylivpopulated()  
    
    return NextResponse.json(auteurs);  
    
    } 
 
export async function POST(request) { 
  ('test')
try { 
    const data = await request.json(); 
    ('Received data:', data);

    const {nomauteur, email,numtel}= data;
 
    const newauteur = await prisma.auteurs.create({ 
      data: {
        nomauteur,
        email,
        numtel
      }
    }); 
 ("new auteur", newauteur)
    return NextResponse.json(newauteur); 
  } catch (error) { 
       return new NextResponse(JSON.stringify(error), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }, 
    }); 
  } 
} 