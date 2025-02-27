"use client";
import { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import Image from "next/image";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button } from "react-bootstrap";
import adminroleprotection from "@/hocs/adminroleprotection";


const Listlivres = ({ livres }) => {


  

  const [searchTitre, setSearchTitre] = useState("");
  const [livresdata, setLivresData] = useState(livres);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!livres.length) {
        setIsLoading(true);
      }
      try {
        let url =
          process.env.URL +
          "/api/livres" +
          `?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`;

        const response = await fetch(url);
        const data = await response.json();

        setLivresData(data.livres);
        setRowCount(data.nbRows);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };

    fetchData();
  }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);

  // Handle delete
  const deletelivre = async (livreId) => {
    try {
      const res = await fetch(`${process.env.URL}/api/livres/${livreId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete livre with id ${livreId}`);
      }

      ("Livre deleted successfully");

       
      setLivresData((prevLivres) => prevLivres.filter((livre) => livre.id !== livreId));
    } catch (error) {
      console.error("Error deleting livre:", error);
      alert("Failed to delete the book");
    }
  };

  const handlefind = (e) => {
    const searchTerm = e.target.value;
    setSearchTitre(searchTerm);
    if (searchTerm === "") {
      setLivresData(livres);
    } else {
      setLivresData(
        livres.filter((item) => item.titre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "couverture",
        header: "Image",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Image
              src={cell.getValue()}
              alt="livre image"
              height="100"
              width="100"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
              priority={false}
            />
          </Box>
        ),
      },
      { accessorKey: "isbn", header: "ISBN", size: 100 },
      { accessorKey: "titre", header: "TITRE", size: 100 },
      { accessorKey: "editeurs.maisonedit", header: "Editeur", size: 100 },
      { accessorKey: "annedition", header: "Année Edition", size: 100 },
      { accessorKey: "prix", header: "Prix", size: 100 },
      { accessorKey: "qtestock", header: "Stock", size: 100 },
      { accessorKey: "specialites.nomspecialite", header: "Spécialité", size: 100 },
      {
        accessorFn: (originalRow) =>
          originalRow.livre_auteur.map((aut, i) => <div key={i}>{aut.auteurs.nomauteur}</div>),
        id: "aut.auteurs.id",
        header: "Auteurs",
      },
      {
        accessorKey: "id",
        header: "Actions",
        size: 100,
        Cell: ({ cell }) => (
          <div>
            <Button size="md" className="text-primary btn-link edit">
              <Link href={`/admin/livres/updatelivre/${cell.row.original.id}`}>
                <EditOutlinedIcon />
              </Link>
            </Button>
            <Button
              onClick={() => deletelivre(cell.row.original.id)}
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
    [livresdata]
  );

  const table = useMaterialReactTable({
    columns,
    data: livresdata,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">Liste des livres</h1>

      <form className="row">
        <div className="col-md-4 d-flex align-items-center">
          <span className="input-group-text">
            <ManageSearchIcon />
          </span>
          <input
            className="form-control col-md-2"
            type="search"
            placeholder="Raccourci Filtre Titre"
            aria-label="Search"
            onChange={handlefind}
          />
        </div>
      </form>

      <Link
        href="/admin/livres/newlivre"
        style={{
          textDecoration: "none",
          color: "aqua",
          fontSize: 14,
        }}
      >
        <AddCircleOutlineIcon /> Nouveau
      </Link>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default adminroleprotection(Listlivres, ['ADMIN', 'SUPERADMIN']);
