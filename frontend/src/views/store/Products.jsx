import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import GetCurrentAddress from "../plugins/UserCountry";
import CartID from "../plugins/CartID";
import Toast from "../../utils/Toast";
import { CartContext } from "../plugins/Context";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [ category, setCategory] = useState([]);
    const [sizeVal, setSizeVal ] = useState(null);
    const [colorVal, setColorVal ] = useState(null);
    const [ selectedProducts, setSelectedProducts ] = useState(null);
    const [ selectedColor, setSelectedColor ] = useState({});
    const [ selectedSize, setSelectedSize ] = useState({});
    const [ quantityValue, setQuantityValue ] = useState(1);

    const userData = UserData();
    const currentAddress = GetCurrentAddress();
    const [cartID, setCartID ] = useState(null);

    const [cartCount, setCartCount] = useContext(CartContext)

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

    const handleColorButtonClick = (product_id, color_name) => {
        setColorVal(color_name);
        setSelectedProducts(product_id);
        setSelectedColor((prevSelectedColor) => (
            {
                ...prevSelectedColor,
                [product_id]: color_name
            }
        ));
    };

    const handleSizeButtonClick = (product_id, size_name) => {
        setSizeVal(size_name);
        setSelectedProducts(product_id);
        setSelectedSize((prevSelectedSize) => ({
            ...prevSelectedSize,
             [product_id]: size_name
        }))
    };

    const handleQuantityChange = (e, product_id) => {
        setQuantityValue(e.target.value);
        setSelectedProducts(product_id);
    };

    const handleAddToCart = async (p) => {
        const formData = new FormData();
        formData.append("user_id ", userData?.user_id || alert("Please login or register to purchase!"));
        formData.append("product_id ", p.id);
        formData.append("quantity", quantityValue);
        formData.append("price ", p.price);
        formData.append("shipping_cost ", p.shipping_cost);

        const res = await apiInstance.get(`cart-list/${cartID}/${userData?.user_id}/`);
        const cartArr = res.data;

        const cartItem = cartArr.find(item => item.product.id === p.id)
        if(cartItem){
           if(p.size.length === 0 && p.color.length > 0){
            if(cartItem.color !== "undefined"){
                if(selectedColor[p.id]){
                    formData.append("color ", selectedColor[p.id]);
                }
                else{
                    formData.append("color ", cartItem.color);
                }
            }
            formData.append("size ", "undefined");
           }
           else if(p.color.length === 0 && p.size.length > 0){
            if(cartItem.size !== "undefined"){
                if(selectedSize[p.id]){
                    formData.append("size ", selectedSize[p.id]);
                }
                else{
                    formData.append("size ", cartItem.size);
                }
            }
            formData.append("color ", "undefined");
           }
           else{
               if(cartItem.color !== "undefined" && cartItem.size !== "undefined"){
                    if(selectedColor[p.id] && selectedSize[p.id]){
                        formData.append("color ", selectedColor[p.id]);
                        formData.append("size ", selectedSize[p.id]);
                    }
                    else if(selectedColor[p.id] && !selectedSize[p.id]){
                        formData.append("color ", selectedColor[p.id]);
                        formData.append("size ", cartItem.size);
                    }
                    else if(selectedSize[p.id] && !selectedColor[p.id]){
                        formData.append("color ", cartItem.color);
                        formData.append("size ", selectedSize[p.id]);
                    }
               }
           }
        }
        else{
            if(p.size.length === 0 && p.color.length > 0){
                if(!selectedColor[p.id]){
                    alert("Please select a color")
                }
                else{
                    formData.append("color ", selectedColor[p.id]);
                    formData.append("size ", "undefined");
                }
            }
            else if(p.color.length === 0 && p.size.length > 0){
                if(!selectedSize[p.id]){
                    alert("Please select a size")
                }
                else{
                    formData.append("size ", selectedSize[p.id]);
                    formData.append("color ", "undefined");
                }
            }
            else{
                if(!selectedColor[p.id] && !selectedSize[p.id]){
                    alert("Please select a color and size")
                }
                else{
                    formData.append("color ", selectedColor[p.id]);
                    formData.append("size ", selectedSize[p.id]);
                }
            }
        }
        
        formData.append("country ", currentAddress.country);
        formData.append("cart_id", cartID);
        
        const response = await apiInstance.post(`cart/${userData?.user_id}/`, formData);

        Toast.fire({
            icon: "success",
            title: response.data.message,
        })

        await apiInstance.get(`cart-list/${cartID}/${userData?.user_id}/`)
        .then((res) => {
            setCartCount(res.data.length);
        })
        .catch((error) => {
            console.log(error.message);
        })
            
    }
    
    useEffect(() => {
        apiInstance
            .get("products/")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        apiInstance.get("category/")
        .then((res) => {
            setCategory(res.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, []);

    const addToWishlist = async (productId, userId) => {
        const formData = new FormData();
        formData.append("user_id ", userId);
        formData.append("product_id ", productId);
        try {
            const response = await apiInstance.post(`customer/wishlist/${userId}/`, formData);

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

    return (
        <>
            <main className="mt-5">
                <div className="container">
                    <section className="text-center">
                        <div className="row">
                            {products?.map((p, index) => (
                            <div className="col-lg-3 col-md-6 mb-4">
                                <div className="card">
                                    <div
                                        className="bg-image hover-zoom ripple"
                                        data-mdb-ripple-color="light"
                                    >
                                        <Link to={`/details/${p.slug}`}>
                                        <img
                                            src={p.image}
                                            className="w-100"
                                            style={{width:"100%", height:"200px", objectFit: "contain"}}
                                        />
                                        </Link>                                        
                                    </div>
                                    <div className="card-body">
                                        <Link to={`/details/${p.slug}`} className="text-reset">
                                            <h5 className="card-title mb-3">
                                                {p.title}
                                            </h5>
                                        </Link>
                                        <a href="" className="text-reset">
                                            <p>{p.category?.title}</p>
                                        </a>
                                        <div className="d-flex justify-content-center">
                                        <h6 className="mb-3">₹{p.price}</h6>
                                        <h6 className="mb-3 text-muted ms-2"><strike>₹{p.old_price}</strike></h6>
                                        </div>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-primary dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuClickable"
                                                data-bs-toggle="dropdown"
                                                data-bs-auto-close="false"
                                                aria-expanded="false"
                                            >
                                                Variation
                                            </button>
                                            <ul
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuClickable"
                                            >
                                            <div className="d-flex flex-column">
                                                <li className="p-1">
                                                    <b>Quantity:</b>
                                                </li>
                                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                <li key={index}>
                                                <input className="form-control" 
                                                type="number" min={1}
                                                onChange={(e) => handleQuantityChange(e, p.id)} />
                                                </li>
                                                </div>
                                            </div>
                                            {p.size.length > 0 && (
                                            <div className="d-flex flex-column">
                                                <li className="p-1">
                                                    <b>Size</b> :  {selectedSize[p.id]}
                                                </li>
                                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                {p.size.map((s, index) => (
                                                <li key={index}>
                                                <button className="btn btn-secondary btn-sm me-2 mb-1"
                                                onClick={() => handleSizeButtonClick(p.id, s.name)}>
                                                {s.name}
                                                </button>
                                                </li>
                                                ))}   
                                                </div>
                                            </div>
                                            )}
                                            {p.color.length > 0 && (
                                            <div className="d-flex flex-column mt-3">
                                                <li className="p-1">
                                                    <b>Color</b> :  {selectedColor[p.id]}
                                                </li>
                                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                    {p.color.map((c, index) => (  
                                                    <li key={index}>
                                                    <button
                                                        className="btn btn-sm me-2 mb-1 p-3"
                                                        style={{
                                                            backgroundColor:
                                                                `${c.color_code}`,
                                                        }}
                                                        onClick={() => handleColorButtonClick(p.id, c.name)}
                                                    />
                                                    </li>
                                                    ))}
                                                </div>
                                            </div>
                                            )}
                                                <div className="d-flex mt-3 p-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary me-1 mb-1 w-100"
                                                        onClick={() => handleAddToCart(p)}
                                                    >
                                                        <i className="fas fa-shopping-cart" />
                                                    </button>
                                                </div>
                                            </ul>
                                            <button
                                                type="button"
                                                className="btn btn-danger px-3 me-1 ms-2"
                                                onClick={() => addToWishlist(p.id, userData?.user_id)}
                                            >
                                                <i className="fas fa-heart" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                            
                            <div className="row my-4">
                                {category?.map((c, index) => (
                                    <div className="col-lg-2" key={index}>
                                    <img
                                         src={c.image}
                                         style={{
                                             width: "100px",
                                             height: "100px",
                                             borderRadius: "50%",
                                             objectFit: "cover",
                                         }}
                                         alt=""
                                    />
                                    <h6>{c.title}</h6>
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    </section>
                    {/*Section: Wishlist*/}
                </div>
            </main>
        </>
    );
};

export default Products;
