import Listauteurs from "@/components/admin/Listauteurs";


 
const getauteurs=async()=>{ 
const response = await fetch(process.env.URL +"/api/auteurs", { cache: 'no-store' }); 
(response); 
const data = await response.json();  
(data); 
return data; 
} 

const auteurPage = async() =>{ 
    const auteurs=await getauteurs() 
     
  return ( 
   <div className="container"> 
      <Listauteurs auteurs={auteurs}/>
    </div> 
) 
} 
export default auteurPage