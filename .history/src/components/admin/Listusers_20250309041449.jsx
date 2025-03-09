"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { MaterialReactTable } from "material-react-table";
import adminroleprotection from "@/hocs/adminroleprotection";


function Listusers() {
  const { data: session, status } = useSession(); // Always call hooks at the top level
   
  // Always initialize state at the top level
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstname',
        header: 'user first name',
        size: 100,
      },
      {
        accessorKey: 'lastname',
        header: 'user last name',
        size: 100,
      },
      {
        accessorKey: 'email',
        header: 'user email',
        size: 100,
      },
      {
        accessorKey: 'adresse',
        header: 'user adresse',
        size: 100,
      },
     
      {
        id: 'role',
        header: 'Change Role',
        size: 150,
        Cell: ({ row }) => {
          const userId = row.original.id;
          const currentRole = row.original.role;
  
          // Check if the current user is a superadmin
          const isSuperAdmin = session.user.role === 'SUPERADMIN';
  
          // If the user is a superadmin, don't show the button for them
          if (isSuperAdmin && row.original.role === 'SUPERADMIN') {
            return <span>Superadmin (cannot change role)</span>;
          }
  
          const handleRoleChangeClick = () => {
            const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN'; // Toggle role
            handleRoleChange(userId, newRole);
          };
  
          return (
            <button onClick={handleRoleChangeClick}>
              Change to {currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN'}
            </button>
          );
        },
      },
      
      
     
      
    ],
    [session]
  );
  // Fetch users only after session is available
  useEffect(() => {
    if (status === "loading") return; // Prevent fetching users while loading

    if (!session || !session.user) {
      return; // Don't attempt to fetch users if there's no session
    }

    const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/users");
          setUsers(response.data);
        } catch (error) {
          setError(error.response?.data?.error || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

    fetchUsers();
  }, [session, status]); // Dependency on session and status

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(process.env.URL +`/api/users/${userId}`, {
        role: newRole,
      });
      // Refresh the user list or update it
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setError("Failed to update role");
    }
  };

  // Early return while loading or no session
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>You need to be logged in to view this page.</div>;
  }


  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Users List</h1>
      <MaterialReactTable
           
           columns={columns}
           data={users}
           
         />
     

      </div>
  );
}

export default adminroleprotection(Listusers, ['ADMIN', 'SUPERADMIN']);
