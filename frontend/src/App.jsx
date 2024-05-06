import React, { useEffect, useState } from "react";
import Login from "./views/auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/auth/Register";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import MainWrapper from "./layout/MainWrapper";
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugins/Context";
import CartID from "./views/plugins/CartID";
import UserData from "./views/plugins/UserData";
import apiInstance from "./utils/axios";
import Account from "./views/customer/Account";
import PrivateRoute from "./layout/PrivateRoute";
import Orders from "./views/customer/Orders";
import OrderDetail from "./views/customer/OrderDetail";
import Wishlist from "./views/customer/Wishlist";
import CustomerNotification from "./views/customer/CustomerNotification";
import CustomerSettings from "./views/customer/CustomerSettings";
import Invoice from "./views/customer/Invoice";
import Dashboard from "./views/vendor/Dashboard";
import Product from "./views/vendor/Product";
import VendorOrders from "./views/vendor/VendorOrders";
import VendorOrderDetail from "./views/vendor/VendorOrderDetail";
import Earning from "./views/vendor/Earning";
import Reviews from "./views/vendor/Reviews";
import ReviewDetails from "./views/vendor/ReviewDetails";
import Coupon from "./views/vendor/Coupon";
import EditCoupon from "./views/vendor/EditCoupon";
import VendorNotification from "./views/vendor/VendorNotification";
import VendorSettings from "./views/vendor/VendorSettings";
import Shop from "./views/vendor/Shop";
import AddProduct from "./views/vendor/AddProduct";
import UpdateProduct from "./views/vendor/UpdateProduct";
import VendorRegister from "./views/vendor/VendorRegister";


function App() {
    const [count, setCount] = useState(0);
    const [cartCount, setCartCount] = useState();
    const [cartId, setCartId] = useState(null);
    const userData = UserData();

    const fetchCartID = async () =>  {
        try {
            const value = await CartID();
            setCartId(value);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCartID();
    }, [])

    const fetchCartList = async () => {
        await apiInstance.get(`cart-list/${cartId}/${userData?.user_id}/`)
        .then((res) => {
            setCartCount(res.data.length);
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    useEffect(() => {
        fetchCartList();
    }, [cartId])

    return (
        <CartContext.Provider value={[cartCount, setCartCount]}>
            <Router>
            <StoreHeader />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/create-new-password"
                    element={<CreatePassword />}
                />

                {/* Store endpoints */}
                <Route path="/" element={<Products />} />
                <Route path="/details/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout/:order_id" element={<Checkout />} />
                <Route path="/payment-success/:order_id" element={<PaymentSuccess />} />
                <Route path="/search" element={<Search />} />

                {/* Customer endpoints */}
                <Route path="/customer/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path="/customer/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                <Route path="/customer/order/:order_id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
                <Route path="/customer/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                <Route path="/customer/notifications" element={<PrivateRoute><CustomerNotification /></PrivateRoute>} />
                <Route path="/customer/settings" element={<PrivateRoute><CustomerSettings /></PrivateRoute>} />
                <Route path="/customer/invoice/:order_id" element={<PrivateRoute><Invoice /></PrivateRoute>} />

                {/* Vendor endpoints */}
                <Route path="/vendor/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/vendor/products" element={<PrivateRoute><Product /></PrivateRoute>} />
                <Route path="/vendor/orders" element={<PrivateRoute><VendorOrders /></PrivateRoute>} />
                <Route path="/vendor/order-details/:order_id" element={<PrivateRoute><VendorOrderDetail /></PrivateRoute>} />
                <Route path="/vendor/earning" element={<PrivateRoute><Earning /></PrivateRoute>} />
                <Route path="/vendor/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
                <Route path="/vendor/reviews/:review_id" element={<PrivateRoute><ReviewDetails /></PrivateRoute>} />
                <Route path="/vendor/coupon" element={<PrivateRoute><Coupon /></PrivateRoute>} />
                <Route path="/vendor/coupon/:coupon_id" element={<PrivateRoute><EditCoupon /></PrivateRoute>} />
                <Route path="/vendor/notifications" element={<PrivateRoute><VendorNotification /></PrivateRoute>} />
                <Route path="/vendor/settings" element={<PrivateRoute><VendorSettings /></PrivateRoute>} />
                <Route path="/vendor/:slug" element={<PrivateRoute><Shop /></PrivateRoute>} />
                <Route path="/vendor/product/new" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
                <Route path="/vendor/product/update/:pid" element={<PrivateRoute><UpdateProduct /></PrivateRoute>} />
                <Route path="/vendor/register" element={<PrivateRoute><VendorRegister /></PrivateRoute>} />
            </Routes>
            <StoreFooter />
            </Router>
        </CartContext.Provider>
    );
}

export default App;
