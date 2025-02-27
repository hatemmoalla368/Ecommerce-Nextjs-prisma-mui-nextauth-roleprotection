import Listlivres from '@/components/admin/Listlivres'; 

 
const getBooks=async()=>{ 
const response = await fetch(process.env.URL +"/api/livres", { cache: 'no-store' }); 
(response); 
const data = await response.json();  
(data); 
return data; 
} 

const LivrePage = async() =>{ 
    const livres=await getBooks() 
     
  return ( 
   <div className="container"> 
      <Listlivres livres={livres} /> 
    </div> 
) 
} 
export default LivrePage