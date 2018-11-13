import React, { Component } from "react";
import propTypes from "prop-types";

class Order extends Component {
  static propTypes = {
    id: propTypes.string.isRequired
  };
  render() {
    return (
      <div>
        <p>Order ID: {this.props.id}</p>
      </div>
    );
  }
}

export default Order;
