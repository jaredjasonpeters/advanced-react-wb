import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import { consolidateStreamedStyles } from "styled-components";
import SickButton from "./styles/SickButton";
import CartStyle from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import User from "./User";
import formatMoney from "../lib/formatMoney";
import CartItem from "../components/CartItem";
import TakeMyMoney from "../components/TakeMyMoney";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;
const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const me = user.data.me;
        const cart = user.data.me.cart;
        if (!cart) return null;

        const itemCount = cart.length;
        const cartTotal = cart.reduce((p, v, i, a) => {
          if (!v.item) return p;
          return (p += v.quantity * v.item.price);
        }, 0);

        return (
          <CartStyle open={localState.data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>
                {me.name}
                's Cart
              </Supreme>
              <p>
                {" "}
                You Have {itemCount} Item
                {itemCount === 1 ? "" : "s"} in your cart.
              </p>
            </header>
            <ul>
              {cart.map(cartItem => {
                return <CartItem key={cartItem.id} cartItem={cartItem} />;
              })}
            </ul>
            <footer>
              <p>{formatMoney(cartTotal)}</p>
              <TakeMyMoney>
                <SickButton> Checkout </SickButton>
              </TakeMyMoney>
            </footer>
          </CartStyle>
        );
      }}
    </Composed>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
