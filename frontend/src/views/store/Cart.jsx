import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from '../../utils/axios';
import UserData from "../plugins/UserData";
import CartID from "../plugins/CartID";
import GetCurrentAddress from "../plugins/UserCountry";
import Toast from "../../utils/Toast";
import { CartContext } from "../plugins/Context";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState({});
    const [cartId, setCartId] = useState(null);
    const [productQuantity, setProductQuantity] = useState('');

    const [ fullName, setFullName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ mobile, setMobile ] = useState("");

    const [address, setAddress ] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [cartCount, setCartCount] = useContext(CartContext)

    const userData = UserData();
    const navigate = useNavigate();
    const currentAddress = GetCurrentAddress();

    const fetchCartData = (cart_id, user_id) => {
     apiInstance.get(`cart-list/${cart_id}/${user_id}/`)
        .then((res) => {
            setCart(res.data);
            setCartCount(res.data.length);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const fetchCartID = async () =>  {
        try {
            const value = await CartID();
            setCartId(value);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCartTotal = (cart_id, user_id) => {
        apiInstance.get(`cart-details/${cart_id}/${user_id}/`)
        .then((res) => {
            setCartTotal(res.data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        fetchCartID();
    }, []);

    useEffect(() =>{
        if(cartId !== null || cartId !== undefined){
                if(userData !== undefined){
                    fetchCartData(cartId, userData?.user_id);
                    fetchCartTotal(cartId, userData?.user_id);        
                }
                else{
                    alert("Please login first to purchase!");
                }
            }
    }, [cartId, userData?.user_id])
    
    const handleQtyChange = (e, product_id) => {
        let quantity = e.target.value;
        setProductQuantity((prevQty) => ({
            ...prevQty,
            [product_id] : quantity
        }))
    }

    useEffect(() => {
        const initialQuantity = {};
        cart.forEach((c) => {
            initialQuantity[c.product?.id] = c.quantity;
        })
        setProductQuantity(initialQuantity);
    }, [cart]);

    const updateCart = async (product_id, price, shipping_cost, color, size) => {
        const qtyVal = productQuantity[product_id]
        
        const formData = new FormData();
        formData.append("user_id ", userData?.user_id || alert("Please login or register to purchase!"));
            formData.append("product_id ", product_id);
            formData.append("quantity", qtyVal);
            formData.append("price ", price);
            formData.append("shipping_cost ", shipping_cost);
            formData.append("color ", color);
            formData.append("size ", size);
            formData.append("country ", currentAddress.country);
            formData.append("cart_id", cartId);

            const response = await apiInstance.post(`cart/${userData?.user_id}/`, formData);
            
            fetchCartData(cartId, userData?.user_id);
            fetchCartTotal(cartId, userData?.user_id);
            
            Toast.fire({
                icon: "success",
                title: response.data.message,
            })
    }

    const handleDeleteCartItem = async (itemId) => {
        const url = userData?.user_id && `cart-delete/${cartId}/${itemId}/${userData.user_id}/`;
        await apiInstance.delete(url);

        fetchCartData(cartId, userData?.user_id);
        fetchCartTotal(cartId, userData?.user_id);
        
        Toast.fire({
            icon: "success",
            title: "Item deleted successfully!",
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'fullName':
                setFullName(value);
                break;

            case 'email':
                setEmail(value);
                break;

            case 'mobile':
                setMobile(value);
                break;

            case 'address':
                setAddress(value);
                break;

            case 'city':
                setCity(value);
                break;

            case 'state':
                setState(value);
                break;

            case 'country':
                setCountry(value);
                break;
            
            default:
                break;
        }
    };

    const createOrder = async () => {
        if(!fullName || !email || !mobile || !address || !city || !state || !country){
            Toast.fire({
                icon: "warning",
                title: "Please fill all the fields!",
            })
        }
        else{
            const formData = new FormData();
            formData.append("user_id ", userData?.user_id || alert("Please login or register to checkout!"));
            formData.append("full_name ", fullName);
            formData.append("email", email);
            formData.append("mobile ", mobile);
            formData.append("address ", address);
            formData.append("city ", city);
            formData.append("state ", state);
            formData.append("country ", country);
            formData.append("cart_id ", cartId);
    
            const response = await apiInstance.post(`create-order/${cartId}/`, formData);
            navigate(`/checkout/${response.data.order_id}`)
            
            Toast.fire({
                icon: "success",
                title: response.data.message,
            })
        }
    }

    return (
        <div>
          <main className="mt-5">
                <div className="container">
                    <main className="mb-6">
                        <div className="container">
                            <section className="">
                                <div className="row gx-lg-5 mb-5">
                                    <div className="col-lg-8 mb-4 mb-md-0">
                                        <section className="mb-5">
                                            {cart?.map((c, index) => (
                                            <div className="row border-bottom mb-4" key={index}>
                                                <div className="col-md-2 mb-4 mb-md-0">
                                                    <div
                                                        className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                                                        data-ripple-color="light"
                                                    >
                                                        <Link to="">
                                                            <img
                                                                src={c.product.image}
                                                                className="w-100"
                                                                alt=""
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100px",
                                                                    objectFit:
                                                                        "contain",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            />
                                                        </Link>
                                                        <a href="#!">
                                                            <div className="hover-overlay">
                                                                <div
                                                                    className="mask"
                                                                    style={{
                                                                        backgroundColor:
                                                                            "hsla(0, 0%, 98.4%, 0.2)",
                                                                    }}
                                                                />
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 mb-4 mb-md-0">
                                                    <Link
                                                        to={null}
                                                        className="fw-bold text-dark mb-4"
                                                    >
                                                        {c.product.title}
                                                    </Link>
                                                    {(c.size !== "undefined") && (c.size !== "null")   && (
                                                        <p className="mb-0">
                                                        <span className="text-muted me-2">
                                                            Size:
                                                        </span>
                                                        <span>{c.size}</span>
                                                        </p>
                                                    )}
                                                    {c.color !== "undefined" && (
                                                        <p className="mb-0">
                                                        <span className="text-muted me-2">
                                                            Color:
                                                        </span>
                                                        <span>{c.color}</span>
                                                        </p>
                                                    )}
                                                    
                                                    <p className="mb-0">
                                                        <span className="text-muted me-2">
                                                            Price:
                                                        </span>
                                                        <span>₹{c.sub_total}</span>
                                                    </p>
                                                    <p className="mb-0">
                                                        <span className="text-muted me-2">
                                                            Qty:
                                                        </span>
                                                        <span>{c.quantity}</span>
                                                    </p>
                                                    <p className="mt-3">
                                                        <button className="btn btn-danger " onClick={() =>handleDeleteCartItem(c.id)}>
                                                            <small>
                                                                <i className="fas fa-trash me-2" />
                                                                Remove
                                                            </small>
                                                        </button>
                                                    </p>
                                                </div>
                                                <div className="col-md-2 mb-4 mb-md-0">
                                                    <div className="form-outline d-flex">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={productQuantity[c.product?.id] || c.quantity}
                                                            onChange={(e) =>handleQtyChange(e, c.product.id)}
                                                            min={1}
                                                        />
                                                        <button className="ms-2 btn btn-primary" 
                                                        onClick={() => updateCart(c.product.id, c.product.price, c.product.shipping_cost, 
                                                        c.size, c.color)}>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-2 mt-3">
                                                            <span className="align-middle">
                                                                ₹{c.sub_total}
                                                            </span>
                                                        </h5>
                                                        <p className="text-dark">
                                                            <small>
                                                                Sub Total
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            )) }

                                            {cart.length === 0 && (
                                            <>
                                            <h5>Your Cart Is Empty</h5>
                                            <Link to='/'> <i className='fas fa-shopping-cart'></i> Continue Shopping</Link>
                                            </>
                                            )}
                                        </section>
                                        {cart.length > 0 && (
                                        <div>
                                            <h5 className="mb-4 mt-4">
                                                Contact Information
                                            </h5>
                                            <div className="row mb-4">
                                                <div className="col-lg-12">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="full_name"
                                                    >
                                                        {" "}
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id=""
                                                        name="fullName"
                                                        className="form-control mb-3"
                                                        onChange={handleChange}
                                                        value={fullName}
                                                    />
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="form6Example1"
                                                    >
                                                        {" "}
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name="email"
                                                        onChange={handleChange}
                                                        value={email}
                                                    />
                                                </div>
                                                <div className="col-lg-6 mb-2">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="form6Example1"
                                                    >
                                                        {" "}
                                                        Mobile
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name="mobile"
                                                        onChange={handleChange}
                                                        value={mobile}
                                                    />
                                                </div>
                                            </div>

                                            <h5 className="mb-1 mt-5">
                                                Shipping address
                                            </h5>

                                            <div className="row mb-4">
                                                <div className="col-lg-6 mt-3">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="form6Example1"
                                                    >
                                                        {" "}
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name="address"
                                                        onChange={handleChange}
                                                        value={address}
                                                    />
                                                </div>
                                                <div className="col-lg-6 mt-3">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="form6Example1"
                                                    >
                                                        {" "}
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name="city"
                                                        onChange={handleChange}
                                                        value={city}
                                                    />
                                                </div>

                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="form6Example1"
                                                        >
                                                            {" "}
                                                            State
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name="state"
                                                            onChange={handleChange}
                                                            value={state}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="form6Example1"
                                                        >
                                                            {" "}
                                                            Country
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name="country"
                                                            onChange={handleChange}
                                                            value={country}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    {cart.length > 0 && (
                                        <div className="col-lg-4 mb-4 mb-md-0">
                                        
                                        <section className="shadow-4 p-4 rounded-5 mb-4">
                                            <h5 className="mb-3">
                                                Cart Summary
                                            </h5>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span>Sub Total </span>
                                                <span>₹{cartTotal.sub_total?.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Shipping </span>
                                                <span>₹{cartTotal.shipping?.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Tax </span>
                                                <span>₹{cartTotal.tax?.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Service Fee </span>
                                                <span>₹{cartTotal.service_fee?.toFixed(2)}</span>
                                            </div>
                                            <hr className="my-4" />
                                            <div className="d-flex justify-content-between fw-bold mb-5">
                                                <span>Total </span>
                                                <span>₹{cartTotal.total?.toFixed(2)}</span>
                                            </div>
                                            <button className="btn btn-primary btn-rounded w-100" onClick={createOrder}>
                                                Proceed to checkout{" "}
                                                <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </section>
                                        {/* <section className="shadow card p-4 rounded">
                                            <h5 className="mb-4">
                                                Apply promo code
                                            </h5>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    className="form-control rounded me-2"
                                                    placeholder="Promo code"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-success btn-rounded overflow-visible"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </section> */}
                                    </div>
                                    )}
                                    
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </main>  
        </div>
    );
};

export default Cart;
