import Newlivres from "@/components/admin/Newlivres";



const getspecialites=async()=>{ 
    const response = await fetch(process.env.URL +"/api/specialites", { cache: 'no-store' }); 
   
    const data = await response.json();  
    console.log(data); 
    return data; 
} 
const getediteurs=async()=>{ 
    const response = await fetch(process.env.URL +"/api/editeurs", { cache: 'no-store' }); 
    console.log(response); 
    const data = await response.json();  
    console.log(data); 
    return data; 
} 
const getauteurs=async()=>{ 
    const response = await fetch(process.env.URL +"/api/auteurs", { cache: 'no-store' }); 
    console.log(response); 
    const data = await response.json();  
    console.log(data); 
    return data; 
} 
const NewlivrePage = async() => { 
    const specialites=await getspecialites() 
    const editeurs = await getediteurs()
    const auteurs = await getauteurs()
     
  return ( 
    <div> 
     <Newlivres specialites={specialites} editeurs={editeurs} auteurs={auteurs}/> 
    </div> 
  ) 
} 
 
export default NewlivrePage