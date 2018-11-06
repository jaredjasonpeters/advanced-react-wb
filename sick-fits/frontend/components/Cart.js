import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { consolidateStreamedStyles } from "styled-components";
import SickButton from "./styles/SickButton";
import CartStyle from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import User from "./User";
import formatMoney from "../lib/formatMoney";
import CartItem from "../components/CartItem";

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

const Cart = () => {
  return (
    <User>
      {({
        data: {
          me: { name, cart }
        }
      }) => {
        if (!cart) return null;

        const itemCount = cart.length;
        const cartTotal = cart.reduce((p, v, i, a) => {
          if (!v.item) return p;
          return (p += v.quantity * v.item.price);
        }, 0);

        return (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => {
              return (
                <Query query={LOCAL_STATE_QUERY}>
                  {({ data, loading, error }) => {
                    return (
                      <CartStyle open={data.cartOpen}>
                        <header>
                          <CloseButton title="close" onClick={toggleCart}>
                            &times;
                          </CloseButton>
                          <Supreme>
                            {name}
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
                            return (
                              <CartItem key={cartItem.id} cartItem={cartItem} />
                            );
                          })}
                        </ul>
                        <footer>
                          <p>{formatMoney(cartTotal)}</p>
                          <SickButton> Checkout </SickButton>
                        </footer>
                      </CartStyle>
                    );
                  }}
                </Query>
              );
            }}
          </Mutation>
        );
      }}
    </User>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
