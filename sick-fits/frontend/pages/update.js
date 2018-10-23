import UpdateItem from '../components/UpdateItem';
import Link from 'next/link'

const Update = (props) => (
    <div>
        <UpdateItem id={props.query.id} />
    </div>
)

export default Update