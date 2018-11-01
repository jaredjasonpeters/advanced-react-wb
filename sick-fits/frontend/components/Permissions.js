import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatedPermissions($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name 
            email
        }
    }

`


const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
` 

const Permissions = (props) => (
    <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
            <div>
                <Error error={error} />
                <div>
                    <h2>Manage Permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {possiblePermissions.map(
                                    permission => <th key={permission}>{permission}</th>
                                )}
                                <th>+</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <UserPermissions key={user.id} user={user}/>)}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
    </Query>
)


class UserPermissions extends React.Component {
    static propTypes = {
        user: propTypes.shape({
            name: propTypes.string,
            email: propTypes.string,
            id: propTypes.string,
            permissions: propTypes.array,
        }).isRequired,
    };

    state = {
        permissions: this.props.user.permissions,
    };

    handlePermissionChange = (e, updatePermissions) => {
        const checkbox = e.target;
        let updatedPermissions = [...this.state.permissions];
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
        }
        this.setState({
            permissions: updatedPermissions
        }, 
        updatePermissions
        )
    }

    render() {
        const user = this.props.user;
        return (
            <Mutation 
            mutation={UPDATE_PERMISSIONS_MUTATION}
            variables={{
                userId: user.id,
                permissions: this.state.permissions
            }} >
            {(updatePermissions, {data, loading, error}) => {
                if (error) return <Error error={error}/>
                return (
                    <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                        {possiblePermissions.map(permission => 
                        {
                            return (
                                <td key={`${permission}-td`}>
                                    <label key={`${permission}-label`} htmlFor={`${user.id}-permissions-${permission}`}>
                                        <input
                                        id={`${user.id}-permissions-${permission}`} 
                                        key={`${permission}-checkbox`} 
                                        type="checkbox" 
                                        checked={ this.state.permissions.includes(permission) }
                                        value={ permission }
                                        onChange={ (e) => this.handlePermissionChange(e, updatePermissions) }
                                        />
                                    </label>
                                </td>
                            )
                        })
                    }
                    <td>
                        <SickButton 
                        type="button" 
                        disabled={loading} 
                        loading={loading} 
                        onClick={ updatePermissions }>
                            Updat{loading ? 'ing' : 'e'}
                        </SickButton>
                    </td>
                </tr>
                )
            }}  
            </Mutation>
        )
    }
}

export default Permissions;