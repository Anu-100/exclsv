import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Sidebar from './Sidebar'
import UserData from '../plugins/UserData'
import apiInstance from '../../utils/axios'
import Toast from '../../utils/Toast'

const EditCoupon = () => {
    const [coupon, setCoupon] = useState({
        code:'',
        discount:'',
        active:true
    })
    const params = useParams()

    const userData = UserData();

    useEffect(() => {
        apiInstance.get(`vendor/coupon-details/${userData?.vendor_id}/${params.coupon_id}/`)
        .then((res) => {
            setCoupon(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }, []);

    const handleCouponChange = (e) => {
        setCoupon({
            ...coupon,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        })
    }

    const handleUpdateCoupon = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("vendor_id", userData?.vendor_id);
        formData.append("code", coupon.code);
        formData.append("discount", coupon.discount);
        formData.append("active", coupon.active);

        await apiInstance.patch(`vendor/coupon-details/${userData?.vendor_id}/${params.coupon_id}/`, formData)
        .then((res) => {
            Toast.fire({
                icon: "success",
                title: "Coupon Updated Successfully",
            })
        })
        .catch((err) => {
            console.log(err.message);
        })
    }


    return (
        <div className="container-fluid" id="main" >
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <h4 className="mt-3 mb-4"><i className="bi bi-tag" /> Coupons</h4>
                    <form className='card shadow p-3' onSubmit={handleUpdateCoupon}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                Code
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                name='code'
                                placeholder='Enter Coupon Code'
                                value={coupon.code}
                                onChange={handleCouponChange}
                            />
                            <div id="emailHelp" className="form-text">
                                E.g DESTINY2024
                            </div>
                        </div>
                        <div className="mb-3 mt-4">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                Discount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="exampleInputPassword1"
                                name='discount'
                                placeholder='Enter Discount'
                                value={coupon.discount}
                                onChange={handleCouponChange}
                            />
                            <div id="emailHelp" className="form-text">
                                NOTE: Discount is in <b>percentage</b>
                            </div>
                        </div>
                        <div className="mb-3 form-check">
                            <input name='active' checked={coupon.active} type="checkbox" className="form-check-input" id="exampleCheck1"
                            onChange={handleCouponChange} />
                            <label className="form-check-label" htmlFor="exampleCheck1">
                                Activate Coupon
                            </label>
                        </div>
                        <div className="d-flex">
                            <Link to="/vendor/coupon/" className="btn btn-secondary">
                                <i className='fas fa-arrow-left'></i> Go Back
                            </Link>
                            <button type="submit" className="btn btn-success ms-2">
                                Update Coupon <i className='fas fa-check-circle'></i>
                            </button>
                        </div>
                    </form>
                </div>


            </div>
        </div >
    )
}

export default EditCoupon