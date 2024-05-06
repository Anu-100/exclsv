import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import Sidebar from "./Sidebar";
import UserData from "../plugins/UserData";
import apiInstance from "../../utils/axios";

const ReviewDetails = () => {
    const [review, setReview] = useState({});
    const [reviews, setReviews] = useState([]);
    const [updateReview, setUpdateReview] = useState({reply:""});
    const userData = UserData();
    const params = useParams();

    const handleUpdateReview = (e) => {
        setUpdateReview({
          ...updateReview,
          [e.target.name]: e.target.value
        })
    }

    const handleReplySubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('reply', updateReview.reply)

        await apiInstance.patch(`vendor/review-details/${userData?.vendor_id}/${params.review_id}/`, formData)
        .then((res) => {
            setReview(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })

        await apiInstance.get(`vendor/reviews/${userData?.vendor_id}/`)
        .then((res) => {
            setReviews(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        apiInstance.get(`vendor/review-details/${userData?.vendor_id}/${params.review_id}/`)
        .then((res) => {
            setReview(res.data);
        })
        .catch((err)=> {
            console.log(err.message);
        })
    }, [])
    
    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                {/*/col*/}
                <div className="col-md-9 col-lg-10 main mt-4">
                    <h4>
                        <i className="fas fa-star" /> Reviews and Rating
                    </h4>

                    <section
                        className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
                        style={{
                            backgroundImage:
                                "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)",
                        }}
                    >
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-md-10">
                            <div className="card mt-3 mb-3">
                                        <div className="card-body m-3">
                                            <div className="row">
                                                <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                                                <div style={{width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden'}}>
                                                <img
                                                src={review?.profile?.image}
                                                className="rounded-circle img-fluid shadow-1"
                                                alt="avatar"
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                />
                                                </div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <p className="text-dark fw-bold mb-4">
                                                        Review:{" "}
                                                        <i>{review?.review}</i>
                                                    </p>
                                                    <p className="text-dark fw-bold mb-4">
                                                        Reply:{" "}
                                                        <i>
                                                        {review?.reply === '' ? 
                                                        <span>No replies</span>
                                                        : review?.reply
                                                        }
                                                        </i>
                                                    </p>
                                                    <p className="fw-bold text-dark mb-2">
                                                        <strong>
                                                            Name:{" "}
                                                            {review?.profile?.full_name}
                                                        </strong>
                                                    </p>
                                                    <p className="fw-bold text-muted mb-0">
                                                        Product:{" "}
                                                        {review?.product?.title}
                                                    </p>
                                                    <p className="fw-bold text-muted mb-0">
                                                        Rating: {review?.rating}
                                                        {review?.rating === 1 && (
                                                            <i className="fas fa-star" />
                                                        )}
                                                        {review?.rating === 2 && (
                                                            <>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </>
                                                        )}
                                                        {review?.rating === 3 && (
                                                            <>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </>
                                                        )}
                                                        {review?.rating === 4 && (
                                                            <>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </>
                                                        )}
                                                        {review?.rating === 5 && (
                                                            <>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </>
                                                        )}
                                                        {review?.rating === 0 && (
                                                            <i>Not rated</i>
                                                        )}
                                                    </p>
                                                    <div className="mt-3">
                                                        <form action="" className="d-flex" onSubmit={handleReplySubmit}>
                                                          <input type="text" value={updateReview.reply} name="reply" placeholder="Write your reply..." className="form-control" onChange={handleUpdateReview} />
                                                          <button type="submit" className="btn btn-success ms-2"> 
                                                              <i className="fas fa-paper-plane"/>
                                                          </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetails;
