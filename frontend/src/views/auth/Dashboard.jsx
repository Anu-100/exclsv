import React, {useEffect} from 'react'
import { userAuthStore } from '../../store/auth'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [ loggedIn, setIsLoggedIn ] = userAuthStore((state) => [
        state.isLoggedIn,
        state.user
    ])
    return (
        <>
        {loggedIn()
        ? (<div>
            <h1>Dashboard</h1>
            <Link to='/logout'>Logout</Link>
        </div>)
        : <div>
            <h1>Home page</h1>
            <div className='d-flex'>
                <Link className='btn btn-primary' to='/register'>Register</Link>
                <Link className='btn btn-primary ms-4' to='/login'>Login</Link>
            </div>
        </div>
        }
        </>
    )
}

export default Dashboard