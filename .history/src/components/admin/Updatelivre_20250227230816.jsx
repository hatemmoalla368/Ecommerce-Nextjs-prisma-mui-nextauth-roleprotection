"use client" 
import React, { useEffect, useState } from 'react'; 
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form'; 
import Col from 'react-bootstrap/Col'; 
import InputGroup from 'react-bootstrap/InputGroup'; 
import Row from 'react-bootstrap/Row'; 
import { useRouter } from "next/navigation"; 

import axios from 'axios'; 
 
import { FilePond,registerPlugin } from 'react-filepond' 
import 'filepond/dist/filepond.min.css'; 
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview' 
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css' 
import Link from 'next/link';
import adminroleprotection from "@/hocs/adminroleprotection";


 
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview) 
const Updatelivre = ({livre,specialites, editeurs, auteurs}) => { 
    
const router = useRouter(); 
const [files, setFiles] = useState([]); 
const [isbn, setIsbn] = useState(""); 
const [titre, setTitre] = useState(""); 
const [annedition, setAnnedition] = useState(""); 
const [prix, setPrix] = useState(""); 
const [qtestock, setQtestock] = useState(""); 
const [couverture, setCouverture] = useState(""); 
const [specialite_id, setSpecialiteid] = useState(""); 
const [editeur_id, setEditeur_id] = useState(""); 
const [auteur_id, setAuteursIds] = useState([]);  
const [validated, setValidated] = useState(false); 

useEffect(() => { 
  setIsbn(livre.isbn); 
  setTitre(livre.titre); 
  setAnnedition(livre.annedition); 
  setPrix(livre.prix); 
  setQtestock(livre.qtestock); 
  setCouverture(livre.couverture); 
  setSpecialiteid(livre.specialite_id); 
  setEditeur_id(livre.editeur_id); 
  
  // Extract author IDs from the many-to-many relationship
  setAuteursIds(livre.livre_auteur.map(la => String(la.auteur_id))); 

  setFiles([ 
    { 
      source: livre.couverture, 
      options: { type: 'local' } 
    } 
  ]); 
}, [livre]);



const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  if (form.checkValidity() === true) {
    const livreedited = {
      isbn,
      titre,
      annedition,
      prix,
      qtestock,
      couverture,
      specialite_id,
      editeur_id,
      auteurs: auteur_id.map(id => ({ auteur_id: Number(id) })) // Ensure correct format
    };
    
    try {
      const response = await fetch(process.env.URL + '/api/livres/' + livre.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livreedited),  
      });

      if (response.ok) {
        router.push('/admin/livres');
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

  
  
  const serverOptions = () => { console.log('server pond'); 
    return { 
      load: (source, load, error, progress, abort, headers) => { 
          var myRequest = new Request(source); 
          fetch(myRequest).then(function(response) { 
            response.blob().then(function(myBlob) { 
              load(myBlob); 
            }); 
          }); 
        }, 
      process: (fieldName, file, metadata, load, error, progress, abort) => 
{ 
          console.log(file) 
        const data = new FormData(); 
         
        data.append('file', file); 
        data.append('upload_preset', 'espssoir2023'); 
        data.append('cloud_name', 'dlaeaf1g1'); 
        data.append('public_id', file.name); 
   
        axios.post('https://api.cloudinary.com/v1_1/dlaeaf1g1/image/upload', 
data) 
          .then((response) => response.data) 
          .then((data) => { 
            console.log(data); 
           setCouverture(data.url) ; 
            load(data); 
          }) 
          .catch((error) => { 
            console.error('Error uploading file:', error); 
            error('Upload failed'); 
            abort(); 
          }); 
      }, 
    }; 
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
<Form.Label >Isbn *</Form.Label> 
<Form.Control 
required 
type="number" 
placeholder="isbn" 
value={isbn} 
onChange={(e)=>setIsbn(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
Saisir isbn Article 
</Form.Control.Feedback> 
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>Titre *</Form.Label> 
<Form.Control 
required 
type="text" 
placeholder="titre" 
value={titre} 
onChange={(e)=>setTitre(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
 
Saisir titre
</Form.Control.Feedback> 
</Form.Group> 
</Row> 
<Row className="mb-2"> 
<Form.Group className="col-md-6"> 
<Form.Label>année d'edition *</Form.Label> 
<InputGroup hasValidation> 
<Form.Control 
type="number" 
required 
placeholder="année d'edition" 
value={annedition} 
onChange={(e)=>setAnnedition(e.target.value)} 
/> 
<Form.Control.Feedback type="invalid"> 
année d'edition Incorrect
</Form.Control.Feedback> 
</InputGroup> 
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>Prix</Form.Label> 
<Form.Control 
type="number" 
placeholder="Prix" 
value={prix} 
onChange={(e)=>setPrix(e.target.value)} 
/> 
</Form.Group> 
</Row> 
<Row className="mb-3"> 
<Form.Group className="col-md-6 "> 
<Form.Label> 
Qté stock<span className="req-tag">*</span> 
</Form.Label> 
<Form.Control 
required 
type="number" 
value={qtestock} 
onChange={(e)=>setQtestock(e.target.value)} 
placeholder="Qté stock" 
/> 
<Form.Control.Feedback type="invalid"> 
Qté stock Incorrect 
</Form.Control.Feedback> 
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>Image</Form.Label> 
<div style={{ width: "80%", margin: "auto", padding: "1%" }}> 
     <FilePond 
                   files={files} 
                   acceptedFileTypes="image/*" 
                   onupdatefiles={setFiles} 
                   allowMultiple={false} 
                   server={serverOptions()} 
                   name="file" 
                       
          /> 
    </div>     
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>Specialité</Form.Label> 
<Form.Control 
as="select" 
type="select" 
value={specialite_id} 
onChange={(e)=>setSpecialiteid(e.target.value)} 
> 
<option></option> 
{specialites.map((spec)=><option key={spec.id} 
value={spec.id}>{spec.nomspecialite}</option> 
)} 
</Form.Control> 
</Form.Group> 
<Form.Group as={Col} md="6"> 
<Form.Label>Editeur</Form.Label> 
<Form.Control 
as="select" 
type="select" 
value={editeur_id} 
onChange={(e)=>setEditeur_id(e.target.value)} 
> 
<option></option> 
{editeurs.map((edit)=><option key={edit.id} 
value={edit.id}>{edit.maisonedit}</option> 
)} 
</Form.Control> 
</Form.Group> 
</Row> 
<Row className="mb-2">
              {/* New Select for Authors */}
              <Form.Group as={Col} md="6">
  <Form.Label>Auteurs</Form.Label>
  <Form.Control
    as="select"
    multiple
    value={auteur_id} // Should be an array of strings
    onChange={(e) => 
      setAuteursIds(Array.from(e.target.selectedOptions, option => option.value))
    }
  >
    <option value="">Sélectionner un auteur</option>
    {auteurs.map((auteur) => (
      <option key={auteur.id} value={String(auteur.id)}>
        {auteur.nomauteur}
      </option>
    ))}
  </Form.Control>
</Form.Group>

            </Row>
</div> 
</div> 
</div> 
<div className="d-flex justify-content-between">
<Button  type="submit">Enregistrer</Button> 
<Button  type="button" className="btn btn-warning" 
as={Link} href="/admin/livres">Annuler</Button> 
 </div>
</Form> 
 
</div> 
</div>
); 
}; 
export default adminroleprotection(Updatelivre, ['ADMIN', 'SUPERADMIN']);
