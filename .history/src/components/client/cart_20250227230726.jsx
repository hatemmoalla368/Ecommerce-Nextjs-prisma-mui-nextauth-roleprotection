"use client"
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "@/features/cart/cartSlice";
import { Button, Table } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import sessionprotection from "@/hocs/sessionprotection";

const Cart = () => {
  const { data: session, status } = useSession();
 
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [adresse, setAdresse] = useState(session?.user?.adresse || "");

  // Calculate the total price of all items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (!session) {
      alert("Please log in to submit an order.");
      return;
    }
    if (!adresse.trim()) {
      alert("Address is required to submit an order.");
      return;
    }
  
    try {
      const totalPrice = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          adresse,
          total: totalPrice,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      ("Order submission response:", data);
  
      dispatch(clearCart());
      alert("Order submitted successfully!");
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Failed to submit order. Please try again.");
    }
  };
  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));  
  };

  const handleClearCart = () => {
    dispatch(clearCart());  
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Your Cart</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Quantity</th>
            <th>Price (€)</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.titre}</td>
              <td>{item.quantity}</td>
              <td>{item.prix.toFixed(2)}</td>
              <td>{(item.prix * item.quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(item.id)}  Remove item from the cart
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold">Total:</td>
            <td className="fw-bold">{totalPrice.toFixed(2)} €</td>
          </tr>
        </tfoot>
      </Table>
     {!session.user.adresse? (

    
        <div>
          <label>Enter your address:</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Your full address"
          />
        </div>
         ):(
          <></>
         )}
      
      <Button
        variant="success"
        onClick={handleSubmitOrder}
        disabled={cart.length === 0 || !session}
      >
        Submit Order
      </Button>
      <Button
        variant="danger"
        onClick={handleClearCart}
        className="my-2"
      >
        Clear Cart
      </Button>
    </div>
  );
};

export default sessionprotection(Cart);