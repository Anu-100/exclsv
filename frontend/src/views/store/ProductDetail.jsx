import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugins/UserCountry";
import UserData from "../plugins/UserData";
import CartID from "../plugins/CartID";
import { CartContext } from "../plugins/Context";
import Toast from "../../utils/Toast";
import moment from 'moment';

const ProductDetail = () => {
    const [ product, setProduct ] = useState({});
    const [ specifications, setSpecifications ] = useState([]);
    const [ gallery, setGallery ] = useState([]);
    const [ colors, setColors ] = useState([]);
    const [ size, setSize ] = useState([]);
    const [ colorVal, setColorVal ] = useState(null);
    const [ sizeVal, setSizeVal ] = useState(null);
    const [ quantity, setQuantity] = useState(1);
    const [ warning, setWarning ] = useState(null);
    const [mainImage, setMainImage] = useState();
    const [reviews, setReviews ] = useState([]);
    const [createReviews, setCreateReviews ] = useState({
        user_id: 0, product_id: product?.id, review: '', rating: 0
    });
    const [cartCount, setCartCount] = useContext(CartContext)

    const params = useParams();
    const currentAddress = GetCurrentAddress();
    const userData = UserData();  
    const [cartID, setCartID] = useState(null);  

    const fetchCartID = async () =>  {
        try {
            const value = await CartID();
            setCartID(value);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCartID();
    }, []);
    
    useEffect(() => {
        apiInstance
            .get(`products/${params.slug}/`)
            .then((res) => {
                setProduct(res.data);
                setMainImage(res.data.image);
                setSpecifications(res.data.specification);
                setGallery(res.data.gallery);
                setColors(res.data.color);
                setSize(res.data.size);
            })
            .catch(() => {
                console.log("Something went wrong!");
            });
    }, []);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = async () => {
        if(!colorVal && size.length === 0){
            setWarning("Please select a color before adding to the cart");
        }
        else if(!sizeVal && colors.length === 0){
            setWarning("Please select a size before adding to the cart");
        }
        else if(!colorVal && !sizeVal){
            setWarning("Please select a color and size before adding to the cart");
        }
        else{
            setWarning(null);
            try {
                const formData = new FormData();
                formData.append("user_id ",userData?.user_id || alert("Please login or register to purchase"));
                formData.append("product_id ",product.id);
                formData.append("price ", product.price);
                formData.append("quantity ", quantity);
                formData.append("color ",colorVal);
                formData.append("size ",sizeVal);
                formData.append("shipping_cost ", product.shipping_cost);
                formData.append("country ", currentAddress.country);
                formData.append("cart_id ",cartID);

                // post request to the cart api view
                const response = await apiInstance.post(`cart/${userData?.user_id}/`, formData);

                Toast.fire({
                    icon: "success",
                    title: response.data.message,
                })
                
                // fetching updated cart information
                apiInstance.get(`cart-list/${cartID}/${userData?.user_id}/`)
                .then((res) => {
                    setCartCount(res.data.length);
                })
                .catch((error) => {
                    console.log(error.message);
                })

            } catch (error) {
                console.log(error);
            }    
        }
    }

    const fetchReviewData = async() => {
        if(product){
            await apiInstance.get(`reviews/${product?.id}/`)
            .then((res) => {
                setReviews(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
    useEffect(() => {
        fetchReviewData();
    },[product]);

    const handleCreateReview = (e) => {
        setCreateReviews({
            ...createReviews,
            [e.target.name]: e.target.value
        })
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("user_id", userData?.user_id)
        formData.append("product_id", product?.id)
        formData.append("rating", createReviews.rating)
        formData.append("review", createReviews.review)

        await apiInstance.post(`reviews/${product?.id}/`, formData)
                .then((res) => {
                    fetchReviewData();
                })
                .catch((error) => {
                    console.log(error.message);
                })
    }

    useEffect(() => {
        console.log(createReviews.rating);
        console.log(createReviews.review);
    })
  
    return (
        <main className="mb-4 mt-4">
            <div className="container">
                {/* Section: Product details */}
                <section className="mb-9">
                    <div className="row gx-lg-5">
                        <div className="col-md-6 mb-4 mb-md-0">
                            {/* Gallery */}
                            <div className="">
                                <div className="row gx-2 gx-lg-3">
                                    <div className="col-12 col-lg-12">
                                        <div className="lightbox">
                                            <img
                                                src={mainImage}
                                                style={{
                                                    width: "100%",
                                                    height: 500,
                                                    objectFit: "contain",
                                                    borderRadius: 10,
                                                }}
                                                alt="Gallery image 1"
                                                className="ecommerce-gallery-main-img active w-100 rounded-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 d-flex">
                                    {gallery.map((g, index) => (
                                        <div className="p-3 ms-3" key={index}>
                                            <img
                                                src={g.image}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "contain",
                                                    borderRadius: 10,
                                                }}
                                                alt="Gallery image 1"
                                                className="ecommerce-gallery-main-img active w-100 rounded-4"
                                                onClick={() => setMainImage(g.image)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Gallery */}
                        </div>
                        <div className="col-md-6 mb-4 mb-md-0">
                            {/* Details */}
                            <div>
                                <h1 className="fw-bold mb-3">
                                    {product.title}
                                </h1>
                                <div className="d-flex text-primary just align-items-center">
                                    <ul
                                        className="mb-3 d-flex p-0"
                                        style={{ listStyle: "none" }}
                                    >
                                        <li>
                                            <i
                                                className="fas fa-star fa-sm text-warning ps-0"
                                                title="Bad"
                                            />
                                            <i
                                                className="fas fa-star fa-sm text-warning ps-0"
                                                title="Bad"
                                            />
                                            <i
                                                className="fas fa-star fa-sm text-warning ps-0"
                                                title="Bad"
                                            />
                                            <i
                                                className="fas fa-star fa-sm text-warning ps-0"
                                                title="Bad"
                                            />
                                            <i
                                                className="fas fa-star fa-sm text-warning ps-0"
                                                title="Bad"
                                            />
                                        </li>

                                        <li
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 13,
                                            }}
                                        >
                                            <a
                                                href=""
                                                className="text-decoration-none"
                                            >
                                                <strong className="me-2">
                                                    {product.product_rating}
                                                </strong>
                                                ({reviews.length} review(s))
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <h5 className="mb-3">
                                    <s className="text-muted me-2 small align-middle">
                                        ₹{product.old_price}
                                    </s>
                                    <span className="align-middle">
                                        ₹{product.price}
                                    </span>
                                </h5>
                                <p className="text-muted">
                                    {product.description}
                                </p>
                                <div className="table-responsive">
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th
                                                    className="ps-0 w-25"
                                                    scope="row"
                                                >
                                                    <strong>Category</strong>
                                                </th>
                                                <td>
                                                    {product.category?.title}
                                                </td>
                                            </tr>
                                            {specifications.map((s, index) => (
                                                <tr key={index}>
                                                    <th
                                                        className="ps-0 w-25"
                                                        scope="row"
                                                    >
                                                        <strong>
                                                            {s.title}
                                                        </strong>
                                                    </th>
                                                    <td>{s.content}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <hr className="my-5" />
                                <div action="">
                                    <div className="row flex-column">
                                        {/* Quantity */}
                                    <div className="col-md-12 mb-2">
                                    <div className="">
                                        <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                        <tr>
                                        <th
                                        className="ps-0 w-25"
                                        scope="row"
                                        >
                                        Quantity
                                        </th>
                                        <td>
                                        <input 
                                            type="number" 
                                            name=""
                                            min={1}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                        />                                   
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                    </div>

                                        {/* Size */}
                                        <div className="col-md-12 mb-2">
                                        <div className="">
                                        {size.length > 0 && (
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th
                                                        className="ps-0 w-25"
                                                        scope="row"
                                                    >
                                                        Size
                                                    </th>
                                                    <td>
                                                    {size.map((s,index) => (
                                                    <button className="btn btn-secondary me-2"
                                                    onClick={() => setSizeVal(s.name)} key={index}>
                                                    {s.name}
                                                    </button>
                                                    )
                                                    )}
                                                    </td>
                                                    <td>
                                                    <h6>{sizeVal}</h6>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        )}
                                        </div>
                                        </div>

                                        {/* Colors */}
                                        <div className="col-md-12 mb-4">
                                            <div className="">
                                                {colors.length > 0 && (
                                                <table className="table table-sm table-borderless mb-0">
                                                <tbody>
                                                <tr>
                                                <th
                                                    className="ps-0 w-25"
                                                    scope="row"
                                                >
                                                    Color
                                                </th>
                                                <td>
                                                {colors.map((c,index) => (
                                                    <button className="btn p-3 me-1" key={index}
                                                    style={{backgroundColor: `${c.color_code}`}}
                                                    type="button" onClick={() => setColorVal(c.name)}>
                                                    </button>
                                                )
                                                )}
                                                </td>
                                                <td>
                                                <h6>{colorVal}</h6>
                                                </td>
                                                </tr>
                                                </tbody>
                                                </table>
                                                )}
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                    {warning && <p className="text-danger">{warning}</p>} 
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-rounded me-2"
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fas fa-cart-plus me-2" />{" "}
                                        Add to cart
                                    </button>
                                    <button
                                        href="#!"
                                        type="button"
                                        className="btn btn-danger btn-floating"
                                        data-mdb-toggle="tooltip"
                                        title="Add to wishlist"
                                    >
                                        <i className="fas fa-heart" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                <ul
                    className="nav nav-pills mb-3"
                    id="pills-tab"
                    role="tablist"
                >
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-home"
                            type="button"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                        >
                            Specifications
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                        >
                            Vendor
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                        >
                            Review
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div
                        className="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                        tabIndex={0}
                    >
                        <div className="table-responsive">
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th className="ps-0 w-25" scope="row">
                                            {" "}
                                            <strong>Category</strong>
                                        </th>
                                        <td>{product.category?.title}</td>
                                    </tr>
                                    {specifications.map((s, index) => (
                                        <tr key={index}>
                                            <th
                                                className="ps-0 w-25"
                                                scope="row"
                                            >
                                                <strong>{s.title}</strong>
                                            </th>
                                            <td>{s.content}</td>
                                        </tr>
                                    ))}

                                    {colors.length > 0 && (
                                        <tr>
                                            <th
                                                className="ps-0 w-25"
                                                scope="row"
                                            >
                                                {" "}
                                                <strong>Colors</strong>
                                            </th>
                                            <td>
                                                {colors
                                                    .map((c, index) => c.name)
                                                    .join(", ")}
                                            </td>
                                        </tr>
                                    )}
                                    {size.length > 0 && (
                                        <tr>
                                            <th
                                                className="ps-0 w-25"
                                                scope="row"
                                            >
                                                {" "}
                                                <strong>Size</strong>
                                            </th>
                                            <td>
                                                {size
                                                    .map((s, index) => s.name)
                                                    .join(", ")}
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <th className="ps-0 w-25" scope="row">
                                            {" "}
                                            <strong>Delivery</strong>
                                        </th>
                                        <td>India</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                        tabIndex={0}
                    >
                        <div className="card mb-3" style={{ maxWidth: 400 }}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={product.vendor?.image}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        alt="User Image"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{product?.vendor?.name}</h5>
                                        <p className="card-text">
                                            {product?.vendor?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="pills-contact"
                        role="tabpanel"
                        aria-labelledby="pills-contact-tab"
                        tabIndex={0}
                    >
                        <div className="container mt-5">
                            <div className="row">
                                {/* Column 1: Form to create a new review */}
                                <div className="col-md-6">
                                    <h2>Create a New Review</h2>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="username"
                                                className="form-label"
                                            >
                                                Rating
                                            </label>
                                            <select
                                                name="rating"
                                                className="form-select"
                                                id=""
                                                onChange={handleCreateReview}
                                            >
                                                <option value="1">
                                                    1 Star
                                                </option>
                                                <option value="2">
                                                    2 Star
                                                </option>
                                                <option value="3">
                                                    3 Star
                                                </option>
                                                <option value="4">
                                                    4 Star
                                                </option>
                                                <option value="5">
                                                    5 Star
                                                </option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="reviewText"
                                                className="form-label"
                                            >
                                                Review
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="reviewText"
                                                rows={4}
                                                placeholder="Write your review"
                                                value={createReviews.review}
                                                onChange={handleCreateReview}
                                                name="review"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                                {/* Column 2: Display existing reviews */}
                                <div className="col-md-6">
                                    <h2>Existing Reviews</h2>
                                    <div className="card mb-3">
                                    {reviews?.map((r, index) =>(
                                        <div className="row g-0 mb-3" key={index}>
                                        <div className="col-md-3">
                                            <img
                                                src={r.profile.image}
                                                alt="User Image"
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {r.profile.full_name}
                                                </h5>
                                                <p className="card-text">
                                                    {moment(r.date).format('Do MMMM YYYY')}
                                                </p>
                                                <p className="card-text">
                                                    {r.review} <br />
                                                    {r.rating ===1 && 
                                                    (<i className="fas fa-star"></i>)
                                                    }
                                                    {r.rating ===2 && 
                                                    (<>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    </>
                                                    )
                                                    }
                                                    {r.rating ===3 && 
                                                    (<>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    </>)
                                                    }
                                                    {r.rating ===4 && 
                                                    (<>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </>)
                                                    }
                                                    {r.rating ===5 && 
                                                    (<>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </>)
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="pills-disabled"
                        role="tabpanel"
                        aria-labelledby="pills-disabled-tab"
                        tabIndex={0}
                    >
                        <div className="container mt-5">
                            <div className="row">
                                {/* Column 1: Form to submit new questions */}
                                <div className="col-md-6">
                                    <h2>Ask a Question</h2>
                                    <form>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="askerName"
                                                className="form-label"
                                            >
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="askerName"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="questionText"
                                                className="form-label"
                                            >
                                                Question
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="questionText"
                                                rows={4}
                                                placeholder="Ask your question"
                                                defaultValue={""}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Submit Question
                                        </button>
                                    </form>
                                </div>
                                {/* Column 2: Display existing questions and answers */}
                                <div className="col-md-6">
                                    <h2>Questions and Answers</h2>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                User 1
                                            </h5>
                                            <p className="card-text">
                                                August 10, 2023
                                            </p>
                                            <p className="card-text">
                                                What are the available payment
                                                methods?
                                            </p>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                Answer:
                                            </h6>
                                            <p className="card-text">
                                                We accept credit/debit cards and
                                                PayPal as payment methods.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                User 2
                                            </h5>
                                            <p className="card-text">
                                                August 15, 2023
                                            </p>
                                            <p className="card-text">
                                                How long does shipping take?
                                            </p>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                Answer:
                                            </h6>
                                            <p className="card-text">
                                                Shipping usually takes 3-5
                                                business days within the India.
                                            </p>
                                        </div>
                                    </div>
                                    {/* More questions and answers can be added here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
