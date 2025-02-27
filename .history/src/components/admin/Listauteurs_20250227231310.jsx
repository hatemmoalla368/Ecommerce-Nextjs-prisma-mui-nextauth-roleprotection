'use client';
import React, { useState, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { MaterialReactTable } from 'material-react-table';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Link from 'next/link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import adminroleprotection from "@/hocs/adminroleprotection";


const Listauteurs = ({ auteurs }) => {
  const [auteurssdata, setAuteursdata] = useState(auteurs);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Initial page index
    pageSize: 10, // Initial page size
  });

  const deleteauteur = async (auteurId) => {
    try {
      const res = await fetch(`${process.env.URL}/api/auteurs/${auteurId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete auteur with id ${auteurId}`);
      }

      console.log('Auteur deleted successfully');
       
      // Update the state to remove the deleted auteur
      setAuteursdata((prevauteurs) => {
        const updatedData = prevauteurs.filter((auteur) => auteur.id !== auteurId);
        console.log('Updated Data:', updatedData);
        return updatedData;
      });
    } catch (error) {
      console.error('Error deleting auteur:', error);
      alert('Failed to delete the auteur');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nomauteur',
        header: 'The Auteur Name',
        size: 100,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 100,
      },
      {
        accessorKey: 'numtel',
        header: 'Phone Number',
        size: 100,
      },
      {
        accessorKey: 'id',
        header: 'Actions',
        size: 100,
        Cell: ({ cell }) => (
          <div>
            <Button size="md" className="text-primary btn-link edit">
              <Link href={`/admin/auteurs/updateauteur/${cell.row.original.id}`}>
                <ModeEditIcon />
              </Link>
            </Button>
            <Button
              onClick={() => deleteauteur(cell.row.original.id)}
              variant="danger"
              size="md"
              className="text-danger btn-link delete"
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="container">
        <h1 className="text-3xl font-semibold">Liste des auteurs</h1>
        <Link
          href="/admin/auteurs/newauteur"
          style={{
            textDecoration: 'none',
            color: 'aqua',
            fontSize: 14,
          }}
        >
          <AddCircleOutlineIcon /> Nouveau
        </Link>

        {/* Pass pagination state and handler to the table */}
        <MaterialReactTable
          key={auteurssdata.length} // Force re-render when data changes
          columns={columns}
          data={auteurssdata}
          initialState={{ pagination }}
          onPaginationChange={(newPagination) => {
            ('Pagination Changed:', newPagination);
            setPagination(newPagination);
          }}
          state={{ pagination: pagination }}  
          manualPagination={false}  
        />
      </div>
    </>
  );
};

export default adminroleprotection(Listauteurs, ['ADMIN', 'SUPERADMIN']);
