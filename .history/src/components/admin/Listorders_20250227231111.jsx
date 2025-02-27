"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { MaterialReactTable } from "material-react-table";
import adminroleprotection from "@/hocs/adminroleprotection";


function Listorders() {
  const { data: session, status } = useSession(); // Always call hooks at the top level
   
  // Always initialize state at the top level
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users only after session is available
  useEffect(() => {
    if (status === "loading") return; 

    if (!session || !session.user) {
      return;  
    }

    const fetchOrders = async () => {
        try {
          const response = await axios.get("/api/orders");
          setOrders(response.data.orders || []);
        } catch (error) {
          setError(error.response?.data?.error || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, [session, status]);  
  const columns = useMemo(
    () => [
      {
        accessorKey: 'user.firstname',
        header: 'user first name',
        size: 100,
      },
      {
        accessorKey: 'user.lastname',
        header: 'user last name',
        size: 100,
      },
      {
        accessorKey: 'user.email',
        header: 'user email',
        size: 100,
      },
      {
        accessorKey: 'user.adresse',
        header: 'user adresse',
        size: 100,
      },
      
      {
        accessorFn: (row) => {
          return row.items
            .map(item => `${item.livre.titre} (Quantity: ${item.quantity})`)
            .join(', ');  
        },
        header: 'Livres',
        size: 200,
      },
      {
        accessorFn: (row) => {
           
          return new Date(row.createdAt).toLocaleString();   
        },
        header: 'Created At',
        size: 200,
      }
      
    ],
    []
  );
  
('list des orders', orders)
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>You need to be logged in to view this page.</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Orders List</h1>
      <MaterialReactTable
           
          columns={columns}
          data={orders}
          
        />
    </div>
  );
}

export default Listusers(Listorders, ['ADMIN', 'SUPERADMIN']);

