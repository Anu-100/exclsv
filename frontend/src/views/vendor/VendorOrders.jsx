import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Sidebar from './Sidebar';
import UserData from '../plugins/UserData';
import apiInstance from '../../utils/axios';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const userData = UserData();

    useEffect(() => {
        apiInstance.get(`vendor/orders/${userData?.vendor_id}/`)
       .then((res) => {
            setOrders(res.data);
       })
       .catch((err) => {
            console.log(err.message);
       })
    }, []);

    const handleFilterOrders = async (filter) => {
        const response = await apiInstance.get(`vendor/orders/filter/${userData?.vendor_id}/?filter=${filter}`)
        setOrders(response.data);
    }

    return (
        <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
            <Sidebar />
            <div className="col-md-9 col-lg-10 main mt-4 ">
                <h4>All Orders</h4>

                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close='false'
                        aria-expanded="false"
                    >
                        Filter <i className="fas fa-sliders"></i>
                    </button>
                    <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                        >
                        <li>
                            <div className="dropdown-item" onClick={() => handleFilterOrders('paid')}>
                            Payment Status: Paid
                            </div>
                        </li>
                        <li>
                            <div className="dropdown-item" onClick={() => handleFilterOrders('pending')}>
                            Payment Status: Pending
                            </div>
                        </li>
                        <li>
                            <div className="dropdown-item" onClick={() => handleFilterOrders('processing')}>
                            Payment Status: Processing
                            </div>
                        </li>
                        <li>
                            <div className="dropdown-item" onClick={() => handleFilterOrders('cancelled')}>
                            Payment Status: Cancelled
                            </div>
                        </li>
                        <hr />
                        <li>
                            <a className="dropdown-item" onClick={() => handleFilterOrders('latest')}>
                            Date: Latest
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" onClick={() => handleFilterOrders('oldest')}>
                            Date: Oldest
                            </a>
                        </li>
                        <hr />
                        <li>
                            <a className="dropdown-item" onClick={() => handleFilterOrders('Pending')}>
                            Order Status: Pending
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" onClick={() => handleFilterOrders('Fulfilled')}>
                            Order Status: Fulfilled
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" onClick={() => handleFilterOrders('Cancelled')}>
                            Order Status: Cancelled
                            </a>
                        </li>
                    </ul>
                </div>

                <table className="table">
                    <thead className="table-dark">
                    <tr>
                        <th scope="col">#Order ID</th>
                        <th scope="col">Total</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Order Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {orders?.map((o, index) => (
                        <tr key={index}>
                            <th scope="row">#{o.order_id}</th>
                            <td>₹{o.total}</td>
                            <td>{o.payment_status?.toUpperCase()}</td>
                            <td>{o.order_status}</td>
                            <td>{moment(o.date).format("Do MMMM YYYY")}</td>
                            <td>
                            <Link to={`/vendor/order-details/${o.order_id}`} className="btn btn-primary mb-1">
                                <i className="fas fa-eye"></i>
                            </Link>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    )
}

export default VendorOrders