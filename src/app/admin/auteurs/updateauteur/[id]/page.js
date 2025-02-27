import Updateauteur from '@/components/admin/Updateauteur';
import React from 'react'
const fetchauteur = async (auteurID) => {
    if (!auteurID) {
      console.error("No livreId provided!");
      return null;
    }
  
    try {
      const res = await fetch(`${process.env.URL}/api/auteurs/${auteurID}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        console.error(`Failed to fetch livre: ${res.status} ${res.statusText}`);
        return null;
      }
  
      return await res.json();
    } catch (error) {
      console.error("Error fetching livre:", error);
      return null;
    }
  };
const page =async ({ params }) => {
    const auteurID =  params.id
    const auteur = await fetchauteur(auteurID)
  return (
    <div>
      <Updateauteur auteur={auteur}/>
    </div>
  )
}

export default page
