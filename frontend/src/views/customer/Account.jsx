import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugins/UserData';

const Account = () => {
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
        <div>
            <main className="mt-5">
            <div className="container">
                <section className="">
                <div className="row">
                    <Sidebar />
                    <div className="col-lg-9 mt-1">
                    <main className="mb-5" style={{}}>
                        <div className="container px-4">
                        <section className=""></section>
                        <section className="">
                            <div className="row rounded shadow p-3">
                            <h2>Hi {profile.full_name}, </h2>
                            <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                                From your account dashboard. you can easily check &amp;
                                view your <Link to="/customer/orders">orders  </Link>
                                 and <Link to="/customer/settings">edit account</Link>
                            </div>
                            </div>
                        </section>
                        </div>
                    </main>
                    </div>
                </div>
                </section>
            </div>
            </main>
        </div>
    )
}

export default Account