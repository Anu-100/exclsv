import React, {useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';
import { useParams } from 'react-router-dom';

const PaymentSuccess = () => {
    const [order, setOrder] = useState([])
    const [status, setStatus] = useState("Verifying")

    const params = useParams();
    const order_id = params.order_id;
    const urlParams = new URLSearchParams(window.location.search)
    const session_id = urlParams.get('session_id')
    
    useEffect(() => {
        apiInstance.get(`checkout/${order_id}/`)
        .then((res) => {
            setOrder(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }, [])

    useEffect(() => {
      const formData = new FormData();
        formData.append("order_id", order_id);
        formData.append("session_id", session_id);

        apiInstance.post(`payment-success/${order_id}/`, formData)
        .then((response) => {
            if(response.data.message === "Payment successful!"){
                setStatus("Payment successful");
            }
            if(response.data.message === "Already paid"){
                setStatus("Already paid")
            }
            if(response.data.message === "Your invoice is unpaid"){
                setStatus("Your invoice is unpaid")
            }
        }).catch((err) => {
          console.log(err);
        })
    }, [])

    return (
        <div>
            <main className="mb-4 mt-4 h-100">
            <div className="container">
            {/* Section: Checkout form */}
            <section className="">
                <div className="gx-lg-5">
                <div className="row">
                    <div className="col-xl-12">
                    <div className="application_statics">
                        <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                            {status === 'Verifying' &&
                             (
                                <div className="col-lg-12">
                                <div className="border border-3 border-warning" />
                                <div className="card bg-white shadow p-5">
                                    <div className="mb-4 text-center">
                                        <i
                                            className="fas fa-spinner fa-spin text-warning"
                                            style={{ fontSize: 100, color: "yellow" }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h1>Verifying</h1>
                                        <p>
                                          Please wait while we are processing you payment <br />
                                          <b>NOTE: Please do not reload the page</b>
                                        </p>
                                    </div>
                                </div>
                                </div>
                            )}
                            {status === 'Already paid' &&
                             (
                                <div className="col-lg-12">
                                <div className="border border-3 border-success" />
                                <div className="card bg-white shadow p-5">
                                  <div className="mb-4 text-center">
                                    <i
                                      className="fas fa-check-circle text-success"
                                      style={{ fontSize: 100, color: "green" }}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <h1>Already Paid!</h1>
                                    <p>
                                      Your checkout was successfull, we have sent the
                                      order detail to your email{" "}
                                    </p>
                                    <button
                                      className="btn btn-success mt-3"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                    >
                                      View Order <i className="fas fa-eye" />{" "}
                                    </button>
                                    <a
                                      href="/"
                                      className="btn btn-primary mt-3 ms-2"
                                    >
                                      Download Invoice{" "}
                                      <i className="fas fa-file-invoice" />{" "}
                                    </a>
                                    <a
                                      className="btn btn-secondary mt-3 ms-2"
                                    >
                                      Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                    </a>
                                  </div>
                                </div>
                                </div>
                            )
                            }
                            {status === 'Payment successful' &&
                             (
                                <div className="col-lg-12">
                                <div className="border border-3 border-success" />
                                <div className="card bg-white shadow p-5">
                                  <div className="mb-4 text-center">
                                    <i
                                      className="fas fa-check-circle text-success"
                                      style={{ fontSize: 100, color: "green" }}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <h1>Payment Successful!</h1>
                                    <p>
                                      Your checkout was successfull, we have sent the
                                      order detail to your email{" "}
                                    </p>
                                    <button
                                      className="btn btn-success mt-3"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                    >
                                      View Order <i className="fas fa-eye" />{" "}
                                    </button>
                                    <a
                                      href="/"
                                      className="btn btn-primary mt-3 ms-2"
                                    >
                                      Download Invoice{" "}
                                      <i className="fas fa-file-invoice" />{" "}
                                    </a>
                                    <a
                                      className="btn btn-secondary mt-3 ms-2"
                                    >
                                      Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                    </a>
                                  </div>
                                </div>
                                </div>
                            )
                            }
                            {status === 'Your invoice is unpaid' && (
                               <div className="col-lg-12">
                               <div className="border border-3 border-danger" />
                               <div className="card bg-white shadow p-5">
                                 <div className="mb-4 text-center">
                                   <i
                                     className="fas fa-ban text-danger"
                                     style={{ fontSize: 100, color: "red" }}
                                   />
                                 </div>
                                 <div className="text-center">
                                   <h1>Your invoice was unpaid</h1>
                                   <p>
                                     Please try again later...
                                   </p>
                                 </div>
                               </div>
                             </div>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            </div>
            <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Order Summary
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
                </div>
                <div className="modal-body">
                <div className="modal-body text-start text-black p-4">
                    <h5
                    className="modal-title text-uppercase "
                    id="exampleModalLabel"
                    >
                    {order.full_name}
                    </h5>
                    <h6>{order.email}</h6>
                    <h6>{order.mobile}</h6>
                    <br />
                    <h6>{order.address}, {order.city}</h6>
                    <h6 className='mb-5'>{order.state}, {order.country}</h6>
                    <p className="mb-0" style={{ color: "#35558a" }}>
                    Payment summary
                    </p>
                    <hr
                    className="mt-2 mb-4"
                    style={{
                        height: 0,
                        backgroundColor: "transparent",
                        opacity: ".75",
                        borderTop: "2px dashed #9e9e9e"
                    }}
                    />
                    {order.orderItems?.map((o, index) => (
                        <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">{o.products.title}</p>
                        <p className="text-muted mb-0">₹{o.sub_total}</p>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between">
                    <p className="mb-0">Subtotal</p>
                    <p className="text-muted mb-0">₹{order.sub_total}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                    <p className="small mb-0">Shipping Fee</p>
                    <p className="small mb-0">₹{order.shipping_cost}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                    <p className="small mb-0">Service Fee</p>
                    <p className="small mb-0">₹{order.service_fee}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                    <p className="small mb-0">Tax</p>
                    <p className="small mb-0">₹{order.tax_fee}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                    <p className="small mb-0">Discount</p>
                    <p className="small mb-0">-₹{order.saved}</p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                    <p className="fw-bold">Total</p>
                    <p className="fw-bold" style={{ color: "#35558a" }}>
                        ₹{order.total}
                    </p>
                    </div>
                </div>

                </div>
            </div>
            </div>
            </div>
            </main>
        </div>
    )
}

export default PaymentSuccess