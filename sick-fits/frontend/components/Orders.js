import React, { Component } from "react";
import { Query } from "react-apollo";
import Link from "next/link";
import gql from "graphql-tag";
import { formatDistatnce, formatDistance } from "date-fns";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import OrderItemStyles from "./styles/OrderItemStyles";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-colums: repeat(auto-fit, minmax(40%, 1fr));
`;

class Orders extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          return (
            <div>
              <h2> You have {orders.length}</h2>
              <OrderUl>
                {orders.map(order => {
                  return (
                    <OrderItemStyles key={order.id}>
                      <Link
                        href={{
                          pathname: "/order",
                          query: { id: order.id }
                        }}
                      >
                        <a>
                          <div className="order-meta">
                            <p>
                              {order.items.reduce((p, v) => {
                                return p + v.quantity;
                              }, 0)}
                              Items
                            </p>
                            <p>{order.items.length} Products</p>
                            <p>
                              Purchased -
                              {formatDistance(order.createdAt, new Date())}- ago
                            </p>
                            <p>{formatMoney(order.total)}</p>
                          </div>
                          <div className="images">
                            {order.items.map(item => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.title}
                              />
                            ))}
                          </div>
                        </a>
                      </Link>
                    </OrderItemStyles>
                  );
                })}
              </OrderUl>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Orders;
