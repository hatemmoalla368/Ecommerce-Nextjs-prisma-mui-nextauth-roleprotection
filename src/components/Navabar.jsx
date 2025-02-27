"use client";

import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSession, signOut, signIn } from "next-auth/react";
import { Badge, NavDropdown } from "react-bootstrap";
import totalQuantity from "@/features/cart/cartSlice"
import { useSelector } from "react-redux";

function NavbarComponent() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const { data: session, status } = useSession();

  // Handling loading state to avoid errors when session is loading
  if (status === "loading") {
    return <div>Loading...</div>; // Or you can return a spinner
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Bibliotheque
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              Cartes des livres
            </Nav.Link>
            {session && (
            <Nav.Link as={Link} href="/cart">
              Panier <Badge bg="secondary">{totalQuantity}</Badge>
            </Nav.Link>
                  )}


            {session ? (
              <>
                <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
                <Nav.Link disabled>Bienvenue, {session.user.name}</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => signIn()}>Login</Nav.Link>
            )}
          </Nav>

          {/* Show Dashboard only for Admin and Superadmin */}
          {session && (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") ? (
            <NavDropdown title="Dashboard" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="/admin/livres">books list</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admin/auteurs">auteurs list</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admin/users">Users list</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admin/orders">orders list</NavDropdown.Item>            
            </NavDropdown>
          ) : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
