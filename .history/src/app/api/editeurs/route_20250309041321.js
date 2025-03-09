import { PrismaClient } from '@prisma/client'; 
import { NextResponse } from "next/server"; 
const prisma = new PrismaClient(); 





export const QueryLiv=async()=>{ 
try { 
const listediteurs=await prisma.editeurs.findMany(); 
return listediteurs 
} catch (error) { 

} 
finally{ 
prisma.$disconnect() 
} 
} 


export async function GET() {  

    const editeurs = await QueryLiv()  
    
    return NextResponse.json(editeurs);  
    
    } 
// CREATE DATA 
export async function POST(request) { 
try { 
    const json = await request.json(); 
 
    const editeur = await prisma.editeurs.create({ 
      data: json, 
    }); 
 
    return NextResponse.json(editeur); 
  } catch (error) { 
       return new NextResponse(JSON.stringify(error), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }, 
    }); 
  } 
} 