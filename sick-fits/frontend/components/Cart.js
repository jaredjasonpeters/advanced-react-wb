import React from "react";
import { consolidateStreamedStyles } from "styled-components";
import SickButton from "./styles/SickButton";
import CartStyle from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";

const Cart = () => {
  return (
    <CartStyle>
      <header>
        <CloseButton title="close">&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p> You Have __ Items in your cart.</p>
      </header>

      <footer>
        <p>$10.10</p>
        <SickButton> Checkout </SickButton>
      </footer>
    </CartStyle>
  );
};

export default Cart;
