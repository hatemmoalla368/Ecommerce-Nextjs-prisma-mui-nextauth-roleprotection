import { PrismaClient } from '@prisma/client'; 
import { NextResponse } from "next/server"; 
const prisma = new PrismaClient(); 





export const QueryLiv=async()=>{ 
try { 
const listspecialites=await prisma.specialites.findMany(); 
return listspecialites 
} catch (error) { 
console.log(error) 
} 
finally{ 
prisma.$disconnect() 
} 
} 


export async function GET() {  

    const specialites = await QueryLiv()  
    
    return NextResponse.json(specialites);  
    
    } 

export async function POST(request) { 
try { 
    const json = await request.json(); 
 
    const specialite = await prisma.specialites.create({ 
      data: json, 
    }); 
 
    return NextResponse.json(specialite); 
  } catch (error) { 
       return new NextResponse(JSON.stringify(error), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }, 
    }); 
  } 
} 