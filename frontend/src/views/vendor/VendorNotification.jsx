import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import apiInstance from '../../utils/axios'
import UserData from '../plugins/UserData'
import moment from 'moment'
import Toast from '../../utils/Toast'

const VendorNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState([]);

    const userData = UserData();

    const fetchNotifications = async () => {
        await apiInstance.get(`vendor/notifications/${userData?.vendor_id}/`)
       .then((res) => {
            setNotifications(res.data);
       })
       .catch((err) => {
            console.log(err.message);
       })
    }

    const fetchNotificationStats = async () => {
        await apiInstance.get(`vendor/notification-summary/${userData?.vendor_id}/`)
        .then((res) => {
            setStats(res.data[0]);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    const MarkNotificationAsSeen = async(notificationID) => {
        await apiInstance.get(`vendor/notification-marked-as-seen/${userData?.vendor_id}/${notificationID}/`)
        .then(() => {
            fetchNotificationStats();
            fetchNotifications();
        })
        .catch((err) => {
            console.log(err.message);
        })

    }

    useEffect(() => {
        fetchNotifications();
        fetchNotificationStats();
    }, [])


    return (
        <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
            <Sidebar />
            <div className="col-md-9 col-lg-10 main mt-4">
            <div className="row mb-3">
                <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                    <div className="card-block bg-danger p-3">
                    <div className="rotate">
                        <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase text-white">Un-read Notification</h6>
                    <h1 className="display-6 text-white">{stats.unseen_notifications}</h1>
                    </div>
                </div>
                </div>
                <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                    <div className="card-block bg-success p-3">
                    <div className="rotate">
                        <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase text-white">Read Notification</h6>
                    <h1 className="display-6 text-white">{stats.seen_notifications}</h1>
                    </div>
                </div>
                </div>
                <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                    <div className="card-block bg-primary p-3">
                    <div className="rotate">
                        <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase text-white">All Notification</h6>
                    <h1 className="display-6 text-white">{stats.total_notifications}</h1>
                    </div>
                </div>
                </div>
            </div>
            <hr />
            <div className="row  container">
                <div className="col-lg-12">
                <h4 className="mt-3 mb-1">
                    {" "}
                    <i className="fas fa-bell" /> Notifications
                </h4>
                <div className="dropdown">
                    <button
                    className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    Filter <i className="fas fa-sliders" />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a className="dropdown-item" href="#">
                        Date: Latest
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                        Date: Oldest
                        </a>
                    </li>
                    <hr />
                    <li>
                        <a className="dropdown-item" href="#">
                        Status: Read
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                        Status: UnRead
                        </a>
                    </li>
                    </ul>
                </div>
                <table className="table">
                    <thead className="table-dark">
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Message</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {notifications?.map((n, index) => (
                            <tr key={index}>
                                <td>New Order</td>
                                <td>
                                You've got a new order for <b>{n.order_item?.products?.title}</b>
                                </td>
                                <td>
                                {n.seen === false 
                                ? <> Unread <i className="fas fa-eye-slash" /> </>
                                : <> Seen <i className='fas fa-eye'/> </>
                                }                            
                                </td>
                                <td>{moment(n.date).format("Do MMMM YYYY")}</td>
                                <td>
                                <button onClick={() => MarkNotificationAsSeen(n?.id)} className="btn btn-secondary mb-1">
                                    <i className="fas fa-eye" />
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default VendorNotification