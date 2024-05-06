import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import UserData from '../plugins/UserData';
import Sidebar from './Sidebar';
import Toast from '../../utils/Toast';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([])
    const userData = UserData();

    const addToWishlist = async (productId, userId) => {
        const formData = new FormData();
        formData.append("user_id ", userId);
        formData.append("product_id ", productId);
        try {
            const response = await apiInstance.post(`customer/wishlist/${userId}/`, formData);
            fetchWishlist();
            Toast.fire({
                icon: "success",
                title: response.data.message,
            })
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: error.message,
            })
        }
    }

    const fetchWishlist = async() => {
        await apiInstance.get(`customer/wishlist/${userData?.user_id}/`)
        .then((res) => {
            setWishlist(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }
    useEffect(() => {
        fetchWishlist();
    }, [])
    

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <section className="">
                                <main className="mb-5" style={{}}>
                                    <div className="container">
                                        <section className="">
                                            <div className="row">
                                                <h3 className="mb-3">
                                                    <i className="fas fa-heart text-danger" /> Wishlist
                                                </h3>
                                                {wishlist?.map((w, index) => (
                                                <div className="col-lg-4 col-md-12 mb-4">
                                                    <div className="card" key={index}>
                                                        <div
                                                            className="bg-image hover-zoom ripple"
                                                            data-mdb-ripple-color="light"
                                                        >
                                                            <Link to={`/details/${w.product?.slug}`}>
                                                            <img
                                                                src={w.product?.image}
                                                                className="w-100"
                                                                style={{width:"100%", height:"200px", objectFit: "contain"}}
                                                            />
                                                            </Link>                                        
                                                        </div>
                                                        <div className="card-body">
                                                            <Link to={`/details/${w.product?.slug}`} className="text-reset text-center"
                                                            style={{textDecoration: 'none'}}>
                                                                <h5 className="card-title mb-3">
                                                                    {w.product?.title}
                                                                </h5>
                                                            </Link>
                                                            <a href="" className="text-reset text-center" style={{textDecoration: 'none'}}>
                                                                <p>{w.product?.category?.title}</p>
                                                            </a>
                                                            <h6 className="mb-3 text-center">₹{w.product?.price}</h6> <br />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger px-3 me-1 ms-2 w-100"
                                                                onClick={() => addToWishlist(w.product.id, userData?.user_id)}
                                                            >
                                                                <i className="fas fa-heart" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}

                                                {wishlist.length === 0 && (
                                                    <h6 className='container'>Your wishlist is Empty </h6>
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

export default Wishlist