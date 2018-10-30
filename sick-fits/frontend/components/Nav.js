import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

<<<<<<< HEAD
const Nav = (props) => (
    <User>
        {({data: { me }}) => (
            <NavStyles>
                {me && <p>{me.name}</p>}
=======
const Nav = () => (
    <User>
        {({data: { me }}) => (
            <NavStyles>
            
>>>>>>> 64000ee3367665f4b899ba4f3399bc4c2a184cc7
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
<<<<<<< HEAD
                        <Signout />
=======
>>>>>>> 64000ee3367665f4b899ba4f3399bc4c2a184cc7
                    </>
                )
                }
        
            </NavStyles>
         )   
        }
    </User>
)

export default Nav