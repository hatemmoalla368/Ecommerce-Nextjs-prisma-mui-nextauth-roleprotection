import { PrismaClient } from '@prisma/client'; 
import { NextResponse } from "next/server"; 
const prisma = new PrismaClient(); 

export const QueryLivPopulatedPagination=async(request)=>{ 
 
  const page_str = request.nextUrl.searchParams.get("page"); 
  const limit_str = request.nextUrl.searchParams.get("limit"); 
 
  const page = page_str ? parseInt(page_str, 10) : 1; 
  const limit = limit_str ? parseInt(limit_str, 10) : 10; 
  const skip = (page - 1) * limit; 
 
  try { 
    const list1 = await prisma.livres.findMany( 
      { 
        skip, 
        take: limit, 
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
       } 
     ) 
    return list1 
  } catch (error) { 
      
  } 
  finally{ 
      prisma.$disconnect() 
  } 
} 

export const QueryLivPopulated=async()=>{ 
  try { 
    const list1 = await prisma.livres.findMany({ 
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
    }) 
    return list1 
  } catch (error) { 
      
  } 
  finally{ 
      prisma.$disconnect() 
  } 
} 

export const QueryLiv=async()=>{ 
try { 
const listl=await prisma.livres.findMany(); 
return listl 
} catch (error) { 

} 
finally{ 
prisma.$disconnect() 
} 
} 


export async function GET(request) {  
  // Choose whether you want to use pagination or not
  const isPaginated = request.nextUrl.searchParams.has("page") && request.nextUrl.searchParams.has("limit");

  let json_response;
  if (isPaginated) {
    const livres = await QueryLivPopulatedPagination(request);
    const livresAll = await QueryLiv() 
    json_response = { 
      status: "success", 
      nbRows: livresAll.length, 
      livres, 
    }; 
  } else {
    json_response = await QueryLivPopulated();
  }

  return NextResponse.json(json_response);
}
// CREATE DATA 


export async function POST(request) {
  try {
    const data = await request.json();
    const { isbn, titre, annedition, prix, qtestock, couverture, specialiteid, editeur_id, auteursIds } = data;

    // Ensure data is being received properly
    
    
    // Create the book (livre)
    const newLivre = await prisma.livres.create({
      data: {
        isbn,
        titre,
        annedition : parseInt(annedition), 
        prix: parseFloat(prix),
        qtestock : parseInt(qtestock),
        couverture,
        specialite_id: parseInt(specialiteid),
        editeur_id: parseInt(editeur_id),
      },
    });

    // If authors were selected, create relationships in the livre_auteur table
    if (auteursIds && auteursIds.length > 0) {
      const livreAuteurs = auteursIds.map(auteurId => ({
        livre_id: newLivre.id,
        auteur_id: parseInt(auteurId),
      }));

      // Log before performing the bulk insert
      console.log('Inserting authors for livre:', livreAuteurs);

      await prisma.livre_auteur.createMany({
        data: livreAuteurs,
      });
    }

    return new Response(JSON.stringify(newLivre), { status: 200 });
  } catch (error) {
    // Log the error to understand what went wrong
    console.error('Error creating livre:', error.message);
    console.error('Error stack trace:', error.stack);
    
    // Provide more detailed error message in response
    return new Response(`Failed to create livre: ${error.message}`, { status: 500 });
  }
}
