import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import UserData from '../plugins/UserData';

const Sidebar = () => {
    const [profile, setProfile] = useState({});
    const userData = UserData();

    useEffect(() => {
        apiInstance.get(`user/profile/${userData?.user_id}`)
        .then((res) => {
            setProfile(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }, [])

    return (
        <div className="col-lg-3">
            <div className="d-flex justify-content-center align-items-center flex-column mb-4 shadow rounded-3">
                <img
                src={profile.image}
                style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: '50%' }}
                alt=""
                />
                <div className="text-center">
                <h3 className="mb-0">{profile.full_name}</h3>
                <p className="mt-0">
                    <Link to="/customer/settings">Edit Account</Link>
                </p>
                </div>
            </div>
            <ol className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">
                        <Link to='/customer/account' className='text-dark' style={{textDecoration: 'none'}}>Account</Link>
                    </div>
                </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">
                        <Link to='/customer/orders' className='text-dark' style={{textDecoration: 'none'}}>Orders</Link>
                    </div>
                </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">
                        <Link to='/customer/wishlist' className='text-dark' style={{textDecoration: 'none'}}>WishList</Link>
                    </div>
                </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                <div className='fw-bold'>
                <Link to='/customer/notifications' className='text-dark' style={{textDecoration: 'none'}}>
                    Notifications
                </Link>
                </div>
                </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                <div className='fw-bold'>
                <Link to='/customer/settings' className='text-dark' style={{textDecoration: 'none'}}>
                    Settings
                </Link>
                </div>
                </div>
                </li>
            </ol>
        </div>
    )
}

export default Sidebar