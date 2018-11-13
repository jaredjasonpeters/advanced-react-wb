import React, { Component } from "react";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import propTypes from "prop-types";
import OrderStyles from "./styles/OrderStyles";
import Error from "./ErrorMessage";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: propTypes.string.isRequired
  };
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          const { order } = data;
          console.log(order);
          return (
            <OrderStyles>
              <Head>
                <title>Sick Fits - Order {order.id}</title>
              </Head>
              <p>
                <span>Order ID: </span>
                <span>{this.props.id}</span>
              </p>
              <p>
                <span>Charge: </span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date: </span>
                <span>{format(order.createdAt, "MMMM d, YYYY h:mm a")}</span>
              </p>
              <p>
                <span>Order Total: </span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Item Count: </span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map(item => {
                  return (
                    <div className="order-item" key={item.id}>
                      <img src={item.image} alt={item.title} />
                      <div className="item-details">
                        <h2>{item.title}</h2>
                        <p>
                          Qty: {item.quantity} &nbsp; Price:{" "}
                          {formatMoney(item.price)} &nbsp; Subtotal:{" "}
                          {formatMoney(item.price * item.quantity)}
                        </p>
                        <p> Description: {item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;
