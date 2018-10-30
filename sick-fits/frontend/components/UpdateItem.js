import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { CREATE_ITEM_MUTATION } from './CreateItem';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`


const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION (
    $id: ID!
    $title: String
    $description: String
    $price: Int
    # $image: String
    # $largeImage: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      # image: $image
      # largeImage: $largeImage 
      ) {
         id
         title 
         description
         price
        }
  }
`

class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    })
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating Item!', 'State:', this.state)
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    });
  }


  render() {
    return (
      <Query 
        query={SINGLE_ITEM_QUERY} 
        variables={{id: this.props.id}}
      >
        {({data, loading}) => {
          
          if (loading) return <p>Loading...</p>; 
          if(!data.item) return <p>No Item Found for ID:{this.props.id} </p>   
          
          
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state} >
              {(updateItem, { loading, error }) => {
                return (
                  <Form onSubmit={e => this.updateItem(e, updateItem)}>
              <Error error={error} />

              <fieldset disabled={loading} aria-busy={loading}>
             
              {/* <label htmlFor="file">
                  Image
                  <input
                    type="file"
                    id="image"
                    name="image"
                    placeholder="Update Image"
                    defaultValue={data.item.image}
                    onChange={this.handleChange}
                    required />
                    {data.item.image && <img src={data.item.image} alt="Current Item Image"/>}
                </label> */}

                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    defaultValue={data.item.title}
                    onChange={this.handleChange}
                    required />
                </label>

                <label htmlFor="price">
                  Price
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="price"
                    defaultValue={data.item.price}
                    onChange={this.handleChange}
                    required />
                </label>

                <label htmlFor="description">
                  Description
                  <textarea
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter a Description"
                    defaultValue={data.item.description}
                    onChange={this.handleChange}
                    required />
                </label>

                <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>

              </fieldset>
            </Form>
              )
            }
          }
      </Mutation>
    )
    }}
    </Query>
    )
  }
}


export default UpdateItem
export { UPDATE_ITEM_MUTATION }