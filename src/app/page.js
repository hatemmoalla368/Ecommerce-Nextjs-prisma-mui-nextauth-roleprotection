import Cartlivres from '@/components/client/Cartlivres';


import React from 'react'
import Providers from './Providers';



const cardlivrespage = async () => {
  const response = await fetch(process.env.URL+'/api/livres', { cache: 'no-store' 
  })
  const livres = await response.json();

  return ( 
    
    <div className="container"> 
    
    
    <Cartlivres livres={livres}/> 
    
    </div> 
    
    ) 
}

export default cardlivrespage
