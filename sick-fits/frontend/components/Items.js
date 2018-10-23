import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';

const All_ITEMS_QUERY = gql`
  query All_ITEMS_QUERY {
    items {
      id
      title
      price
      description
    }
  }
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin 0 auto;
`

const Center = styled.div`
  text-align: center;

`

export default class Items extends Component {
  render() {
    return (
      <Center>
        <p>Items!</p>
        <Query query={All_ITEMS_QUERY}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error: {error.message}</p>
            return <ItemsList>
              {data.items.map(item => {
                return <Item key={item.id} item={item} />
              })}
            </ItemsList>
          }}
        </Query>
      </Center>
    )
  }
}

export { All_ITEMS_QUERY }