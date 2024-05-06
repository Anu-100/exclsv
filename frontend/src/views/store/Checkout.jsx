import React, { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import { useParams, useNavigate } from 'react-router-dom'
import Toast from '../../utils/Toast'
import { SERVER_URL } from '../../utils/constants'

const Checkout = () => {
    const [order, setOrder] = useState([])
    const [couponCode, setCouponCode] = useState("")
    const [paymentLoading, setPaymentLoading] = useState(false)
    const params = useParams();
    const navigate = useNavigate();

    const fetchOrderData = async() => {
        apiInstance.get(`checkout/${params.order_id}/`)
        .then((res) => {
            setOrder(res.data);
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    useEffect(() => {
        fetchOrderData();
    }, []);

    

    const applyCoupon = async () => {

        const formData = new FormData();
        formData.append("order_id", order.order_id);
        formData.append("coupon_code", couponCode);

        try {           
            const response = await apiInstance.post("coupon/", formData);
            fetchOrderData();
            Toast.fire({
                icon: response.data.icon,
                title: response.data.message,
            })
        } catch (error) {
            console.log(error);
        }
    }

    const payWithStripe = (e) => {
        setPaymentLoading(true);
        e.target.form.submit();
    }

    return (
        <div>
        <main className="mb-4 mt-4">
                <div className="container">
                    <section className="">
                        <div className="row gx-lg-5">
                            <div className="col-lg-8 mb-4 mb-md-0">
                                <section className="">
                                    <div className="alert alert-warning">
                                        <strong>Review Your Shipping &amp; Order Details </strong>
                                    </div>
                                    <form>
                                        <h5 className="mb-4 mt-4">Contact information</h5>
                                        <div className="row mb-4">

                                            <div className="col-lg-12">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name='fullName'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.full_name}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">Email</label>
                                                    <input
                                                        type="text"
                                                        name='email'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.email}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">Mobile</label>
                                                    <input
                                                        type="text"
                                                        name='mobile'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.mobile}
                                                    />
                                                </div>
                                            </div>
                                            <h5 className='mt-4'>Shipping Address</h5>
                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">Address</label>
                                                    <input
                                                        type="text"
                                                        name='address'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.address}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">City</label>
                                                    <input
                                                        type="text"
                                                        name='city'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.city}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">State</label>
                                                    <input
                                                        type="text"
                                                        name='state'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.state}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mt-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example2">Country</label>
                                                    <input
                                                        type="text"
                                                        name='country'
                                                        className="form-control"
                                                        readOnly
                                                        value={order.country}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <h5 className="mb-4 mt-4">Billing address</h5>
                                        <div className="form-check mb-2">
                                            <input className="form-check-input me-2" type="checkbox" defaultValue="" id="form6Example8" defaultChecked="" />
                                            <label className="form-check-label" htmlFor="form6Example8">
                                                Same as shipping address
                                            </label>
                                        </div>
                                    </form>
                                </section>
                                {/* Section: Biling details */}
                            </div>
                            <div className="col-lg-4 mb-4 mb-md-0">
                                {/* Section: Summary */}
                                <section className="shadow p-4 rounded-5 mb-4">
                                    <h5 className="mb-3">Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Subtotal </span>
                                        <span>₹{order.sub_total}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Shipping </span>
                                        <span>₹{order.shipping_cost}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Tax </span>
                                        <span>₹{order.tax_fee}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Service Fee </span>
                                        <span>₹{order.service_fee}</span>
                                    </div>
                                    {order.saved !== "0.00" && (
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Discount </span>
                                        <span>-₹{order.saved}</span>
                                    </div>
                                    )}
                                    <hr className="my-4" />
                                    <div className="d-flex justify-content-between fw-bold mb-5">
                                        <span>Total </span>
                                        <span>₹{order.total}</span>
                                    </div>

                                    <section className='shadow-4 p-3 mt-4 mb-4'>
                                        <h5 className="mb-4">
                                            Apply promo code
                                        </h5>
                                    <div className="d-flex">
                                        <input name="couponCode" 
                                               type="text" 
                                               className='form-control' 
                                               style={{ border: "dashed 1px gray" }} 
                                               placeholder='Enter Coupon Code' 
                                               id="" 
                                               onChange={(e) => setCouponCode(e.target.value)} 
                                        />
                                        <button className='btn btn-success ms-1' onClick={applyCoupon}><i className='fas fa-check-circle'></i></button>
                                    </div>
                                    </section>
                                    {paymentLoading
                                    ?
                                    (
                                    <form action={`${SERVER_URL}/api/v1/stripe-checkout/${order.order_id}/`} method='POST'>
                                        <button disabled className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }} onClick={payWithStripe} >
                                        Processing...</button>
                                    </form>
                                    )
                                    :
                                    (
                                    <form action={`${SERVER_URL}/api/v1/stripe-checkout/${order.order_id}/`} method='POST'>
                                        <button type="submit" className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }} onClick={payWithStripe} >
                                        Pay With Stripe</button>
                                    </form>)
                                    }

                                </section>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Checkout