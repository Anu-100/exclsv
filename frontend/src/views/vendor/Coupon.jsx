import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Sidebar from './Sidebar'
import UserData from '../plugins/UserData'
import apiInstance from '../../utils/axios'
import Toast from '../../utils/Toast'

const Coupon = () => {
    const [stats, setStats] = useState({})
    const [coupons, setCoupons] = useState([])
    const [createCoupon, setCreateCoupon] = useState({
        code: '',
        discount: '',
        active: true
    })

    const userData = UserData();

    const fetchCouponData = async () => {
        await apiInstance.get(`vendor/coupon-stats/${userData?.vendor_id}/`)
        .then((res) => {
            setStats(res.data[0]);
        })
        .catch((err) => {
            console.log(err.message);
        })

        await apiInstance.get(`vendor/coupons/${userData?.vendor_id}/`)
        .then((res) => {
            setCoupons(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    const handleCouponDelete =async (couponID) => {
        await apiInstance.delete(`vendor/coupon-details/${userData?.vendor_id}/${couponID}/`)
        .then(() => {
            Toast.fire({
                icon: "success",
                title: "Coupon deleted successfully",
            })
            fetchCouponData();
        })
    }

    const handleCouponChange = (e) => {
        setCreateCoupon({
            ...createCoupon,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        })
    }

    const handleCouponCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("vendor_id", userData?.vendor_id);
        formData.append("code", createCoupon.code);
        formData.append("discount", createCoupon.discount);
        formData.append("active", createCoupon.active);

        await apiInstance.post(`vendor/coupons/${userData?.vendor_id}/`, formData)
        .then((res) => {
            Toast.fire({
                icon: "success",
                title: res.data.message,
            })
            fetchCouponData();
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        fetchCouponData();
    }, []);


    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
            <Sidebar/>
            <div className="col-md-9 col-lg-10 main mt-4">
                <div className="row mb-3">
                <div className="col-xl-6 col-lg-6 mb-2">
                    <div className="card card-inverse card-success">
                    <div className="card-block bg-success p-3">
                        <h6 className="text-uppercase">Total Coupons</h6>
                        <h1 className="display-1">{stats.total_coupons}</h1>
                    </div>
                    </div>
                </div>
                    <div className="col-xl-6 col-lg-6 mb-2">
                    <div className="card card-inverse card-danger">
                        <div className="card-block bg-danger p-3">
                        <div className="rotate">
                            <i className="bi bi-check-circle fa-5x"></i>
                        </div>
                            <h6 className="text-uppercase">Active Coupons</h6>
                            <h1 className="display-1">{stats.active_coupons}</h1>
                        </div>
                        <i className="bi bi-check-circle fa-5x"></i>
                    </div>
                    <i className="bi bi-check-circle fa-5x"></i>
                    </div>
                </div>
                <hr />
                <div className="row  container">
                <div className="col-lg-12">
                    {coupons.length > 0 ? 
                    <>
                    <h4 className="mt-3 mb-4">
                    Coupons
                    </h4>
                    <table className="table">
                        <thead className="table-dark">
                        <tr>
                            <th scope="col">Code</th>
                            <th scope="col">Type</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {coupons?.map((c, index) => (
                            <tr key={index}>
                                <td>{c.code}</td>
                                <td>Percentage</td>
                                <td>{c.discount}</td>
                                {c.active === true ? 
                                <td>Active</td>
                                :
                                <td>Inactive</td>
                                }
                                <td>
                                <Link to={`/vendor/coupon/${c.id}`} className="btn btn-primary mb-1 ms-2">
                                    <i className="fas fa-edit"></i>
                                </Link>
                                <button onClick={() => handleCouponDelete(c.id)} className="btn btn-danger mb-1 ms-2">
                                    <i className="fas fa-trash"></i>
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </>
                    :
                    <>
                    <h5 className='text-center mt-5'>No coupons yet</h5>
                    </>
                    }
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i className='fas fa-plus'></i> Create a new coupon
                    </button>
                    <div className="modal fade" id="exampleModal" tab="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={handleCouponCreate}>
                            <div className="mb-3">
                                <label htmlFor="code" className="form-label">Code</label>
                                <input type="text" name='code' value={createCoupon.code} 
                                onChange={handleCouponChange}
                                className="form-control" id="code" aria-describedby="emailHelp"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="discount" className="form-label">Discount</label>
                                <input type="text" name='discount' value={createCoupon.discount} onChange={handleCouponChange} className="form-control" id="discount"/>
                                <div id="emailHelp" className="form-text">In percentage</div>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" name='active' value={createCoupon.active} onChange={handleCouponChange}
                                className="form-check-input" id="exampleCheck1"/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Create coupon</button>
                        </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Coupon