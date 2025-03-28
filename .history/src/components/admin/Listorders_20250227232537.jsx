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
    if (status === "loading") return; // Prevent fetching users while loading

    if (!session || !session.user) {
      return; // Don't attempt to fetch users if there's no session
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
  }, [session, status]); // Dependency on session and status
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
            .join(', '); // Join the formatted items with commas
        },
        header: 'Livres',
        size: 200,
      },
      {
        accessorFn: (row) => {
          // Format the 'createdAt' date to a readable format
          return new Date(row.createdAt).toLocaleString();  // Converts to a locale string, e.g., '2/25/2025, 10:00:00 AM'
        },
        header: 'Created At',
        size: 200,
      }
      
    ],
    []
  );
  
console.log('list des orders', orders)
  // Early return while loading or no session
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

export default adminroleprotection(Listorders, ['ADMIN', 'SUPERADMIN']);

