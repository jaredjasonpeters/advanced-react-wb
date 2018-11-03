import Link from 'next/link';
import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import {TOGGLE_CART_MUTATION} from './Cart';

const Nav = (props) => (
    <User>
        {({data: { me }}) => (
            <NavStyles>
                {me && <p>{me.name}</p>}
                <Link href="/items">
                    <a>Shop</a>
                </Link>
                {!me &&
                     <Link href="/signup">
                        <a>Sign In</a>
                    </Link>
                }
                {me && (
                    <>
                        <Link href="/sell">
                            <a>Sell</a>
                        </Link>
                        
                        <Link href="/orders">
                            <a>Orders</a>
                        </Link>
                        
                        <Link href="/me">
                            <a>Account</a>
                        </Link>
                        <Signout />
                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {toggleCart => {
                                return (
                                    <button onClick={toggleCart}>My Cart</button>
                                )
                            }}
                        </Mutation>
                    </>
                )
                }
        
            </NavStyles>
         )   
        }
    </User>
)

export default Nav