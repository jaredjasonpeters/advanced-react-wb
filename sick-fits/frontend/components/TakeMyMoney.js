import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import propTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((total, item) => {
    return (total += item.quantity);
  }, 0);
}

class TakeMyMoney extends Component {
  onToken = async (res, createOrder, client) => {
    NProgress.start();

    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      alert(err.message);
    });
    client.mutate({
      mutation: TOGGLE_CART_MUTATION
    });
    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => {
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {(createOrder, { data, loading, error, client }) => {
                return (
                  <StripeCheckout
                    amount={calcTotalPrice(me.cart)}
                    name="Sick Fits"
                    description={`Order of ${totalItems(me.cart)} items`}
                    image={
                      me.cart.length && me.cart[0].item && me.cart[0].item.image
                    }
                    stripeKey="pk_test_qjSwtsTNWqgxXlrrHnp8Vhbe"
                    currency="USD"
                    email={me.email}
                    token={res => this.onToken(res, createOrder, client)}
                  >
                    {this.props.children}
                  </StripeCheckout>
                );
              }}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
