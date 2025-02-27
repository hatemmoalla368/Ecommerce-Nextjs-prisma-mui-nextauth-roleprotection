"use client"
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import Card from '@mui/material/Card';
 import CardActions from '@mui/material/CardActions';
 import CardContent from '@mui/material/CardContent';
 import CardMedia from '@mui/material/CardMedia';
 import Button from '@mui/material/Button';
 import Typography from '@mui/material/Typography';
 import React from 'react'
import { useSession } from "next-auth/react";

const Cartlivres = ({ livres }) => {
  const { data: session } = useSession(); // Get session

  const dispatch = useDispatch();
  const handleAddToCart = (liv) => {
    if (!session) {
      alert("Please log in to add items to your cart."); // Show an alert if the user is not logged in
    } else {
      dispatch(addToCart(liv)); // Dispatch addToCart if the user is logged in
    }
  };

  return (
    <React.Fragment>
      {livres &&
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "left" }}>
          {livres.map((liv, ind) => (
            <Card sx={{ maxWidth: 'auto', margin: 1 }} key={ind}>
              <CardMedia component="img" alt="image" height="160" image={liv.couverture} />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Titre : {liv.titre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN : {liv.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Specialité : {liv.specialites.nomspecialite}
                </Typography>
                {liv.livre_auteur.map((aut, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    Auteur : {aut.auteurs.nomauteur}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
              
                <Button
                  disabled={liv.qtestock <= 1}
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => handleAddToCart(liv)}
                  
                >
                  {liv.qtestock <= 1 ? "OUT OF STOCK" : "Add to cart"}
                </Button>
                            

              </CardActions>
            </Card>
          ))}
        </div>
      }
    </React.Fragment>
  );
};
export default Cartlivres