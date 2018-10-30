

import Reset from '../components/Reset';
import Link from 'next/link'

const ResetPage = (props) => (
    <div>
        <p>Reset your password!</p>
        <Reset resetToken={props.query.resetToken.toString()} />
    </div>
)

export default ResetPage