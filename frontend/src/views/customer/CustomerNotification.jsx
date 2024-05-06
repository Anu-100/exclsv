import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import Toast from '../../utils/Toast';
import UserData from '../plugins/UserData';
import moment from 'moment';

const CustomerNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const userData = UserData();

    const fetchNotifications = async () => {
        await apiInstance.get(`customer/notifications/${userData?.user_id}/`)
        .then((res) => {
            setNotifications(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }
    useEffect(() => {
        fetchNotifications();
    }, [])

    const markNotificationAsSeen = async (notificationId) => {
        await apiInstance.get(`customer/notification/${userData?.user_id}/${notificationId}/`)
        .then(() => {
            fetchNotifications();
            Toast.fire({
                icon:'success',
                title: 'Notification marked as seen'
            })
        })
        .catch((err) => {
            console.log(err.message);
        })

    }

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                <div className="row">
                    <Sidebar />
                    <div className="col-lg-9 mt-1">
                    <section className="">
                        <main className="mb-5" style={{}}>
                        <div className="container px-4">
                            <section className="">
                            <h3 className="mb-3">
                                <i className="fas fa-bell" /> Notifications{" "}
                            </h3>
                            <div className="list-group">
                                {notifications.map((n, index) => (
                                    <a
                                    href="#"
                                    className="list-group-item list-group-item-action"
                                    >
                                    <div className="d-flex w-100 justify-content-between" key={index}>
                                        <h5 className="mb-1">Order placed successfully</h5>
                                        <small className="text-muted">{moment(n.date).format('Do MMMM YYYY')}</small>
                                    </div>
                                    <p className="mb-1">
                                        Your order has been confirmed.
                                    </p>
                                    <button className='btn btn-success mt-3' 
                                    onClick={() => markNotificationAsSeen(n.id)}
                                    >
                                        <i className='fas fa-eye'/>
                                    </button>
                                    </a>
                                ))}
                                {notifications.length === 0 && (
                                    
                                    <h5 className="p-4">No notifications</h5>
                                )}
                            </div>
                            </section>
                        </div>
                        </main>
                    </section>
                    </div>
                </div>
                </section>
            </div>
        </main>
    )
}

export default CustomerNotification