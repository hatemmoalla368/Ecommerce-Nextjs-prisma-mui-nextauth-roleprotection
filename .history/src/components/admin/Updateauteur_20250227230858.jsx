"use client" 
import React, { useEffect, useState } from 'react'; 
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form'; 
import Col from 'react-bootstrap/Col'; 
import InputGroup from 'react-bootstrap/InputGroup'; 
import Row from 'react-bootstrap/Row'; 
import { useRouter } from "next/navigation"; 

import axios from 'axios'; 
 

import Link from 'next/link';
import adminroleprotection from "@/hocs/adminroleprotection";


 

const Updateauteur = ({auteur}) => { 
    console.log("the auteur id", auteur.id)
const router = useRouter(); 

const [nomauteur, setNomauteur] = useState(""); 
const [email, setEmail] = useState(""); 
const [numtel, setNumtel] = useState(""); 

const [validated, setValidated] = useState(false); 
useEffect(() => { 
  setNomauteur(auteur.nomauteur); 
  setEmail(auteur.email); 
  setNumtel(auteur.numtel); 
 
  
  // Extract author IDs from the many-to-many relationship
  //setAuteursIds(livre.livre_auteur.map(la => String(la.auteur_id))); 

  
}, [auteur]);

const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === true) {
      const auteuredited = {
        nomauteur,
        email,
        numtel,
        
      };
      
      try {
        const response = await fetch(process.env.URL + '/api/auteurs/' + auteur.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(auteuredited),  
        });
  
        if (response.ok) {
          router.push('/admin/auteurs');
          router.refresh();
        } else {
          throw new Error('Failed to edit data');
        }
      } catch (error) {
        alert('Erreur ! édition non effectuée');
      }
    }
  
    setValidated(true);
  };
  
  

 
return ( 
    <div className="container w-100 d-flex justify-content-center flex-column align-items-center">
<div> 
 
 <Form  validated={validated} onSubmit={handleSubmit}> 
 
 <h2 className="mb-4">Ajout livre</h2> 
 
<div className="container w-100 d-flex justify-content-center"> 
<div> 
<div className='form mt-3'> 
<Row className="mb-2"> 
<Form.Group as={Col} md="6" > 
<Form.Label >the auteur name *</Form.Label> 
<Form.Control 
required 
type="text" 
placeholder="nomauteur" 
value={nomauteur} 
onChange={(e)=>setNomauteur(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
type the name of the auteur
</Form.Control.Feedback> 
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>email *</Form.Label> 
<Form.Control 
required 
type="email" 
placeholder="email" 
value={email} 
onChange={(e)=>setEmail(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
 
type email
</Form.Control.Feedback> 
</Form.Group> 
</Row> 
<Row className="mb-2"> 
<Form.Group className="col-md-6"> 
<Form.Label>phone number</Form.Label> 
<InputGroup hasValidation> 
<Form.Control 
type="number" 
required 
placeholder="phone" 
value={numtel} 
onChange={(e)=>setNumtel(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
wrong phone number</Form.Control.Feedback> 
</InputGroup> 
</Form.Group> 

</Row> 


</div> 
</div> 
</div> 
<div className="d-flex justify-content-between">
<Button  type="submit">Enregistrer</Button> 
<Button  type="button" className="btn btn-warning" 
as={Link} href="/admin/auteurs">Annuler</Button> 
 </div>
</Form> 
 
</div> 
</div>
); 
}; 
export default adminroleprotection(Updateauteur, ['ADMIN', 'SUPERADMIN']);

