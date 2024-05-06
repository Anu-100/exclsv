import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import UserData from '../plugins/UserData';
import apiInstance from '../../utils/axios';
import Toast from '../../utils/Toast';

const VendorRegister = () => {
    const [vendor, setVendor] = useState({
        image: null,
        name: "",
        email: "",
        description: "",
        mobile: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const userData = UserData();

    const handleInputChange = (e) => {
        setVendor({
            ...vendor,
            [e.target.name] : e.target.value
        })
    }
    const handleFileChange = (e) => {
        setVendor({
            ...vendor,
            [e.target.name] : e.target.files[0]
        })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        setIsLoading(true)

        formData.append('image', vendor.image);
        formData.append('name', vendor.name);
        formData.append('email', vendor.email);
        formData.append('description', vendor.description);
        formData.append('mobile', vendor.mobile);
        formData.append('user_id', userData?.user_id);

        await apiInstance.post(`vendor/register/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            Toast.fire({
                icon: "success",
                text: res.data.message
            })
            setIsLoading(false);
            navigate('/logout'); // User will have to login again in order to access the vendor dashboard
        })
        .catch((err) => {
            console.log(err.message)
        })
    }

    return (
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
            <div className="container">
                {/* Section: Login form */}
                <section className="">
                    <div className="row d-flex justify-content-center">
                        <div className="col-xl-5 col-md-8">
                            <div className="card rounded-5">
                                <div className="card-body p-4">
                                    <h3 className="text-center">Register Vendor Account</h3>
                                    <br />

                                    <div className="tab-content">
                                        <div
                                            className="tab-pane fade show active"
                                            id="pills-login"
                                            role="tabpanel"
                                            aria-labelledby="tab-login"
                                        >
                                            <form onSubmit={handleSubmit} encType='multipart/form-data' action='POST'>
                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="Shop Name">
                                                        Shop Avatar
                                                    </label>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        name='image'
                                                        placeholder="Shop Avatar"
                                                        required
                                                        className="form-control"

                                                    />
                                                </div>
                                                {/* Email input */}
                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="Shop Name">
                                                        Shop Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        onChange={handleInputChange}
                                                        name='name'
                                                        placeholder="Shop Name"
                                                        required
                                                        className="form-control"

                                                    />
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="loginName">
                                                        Shop Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        onChange={handleInputChange}
                                                        name='email'
                                                        placeholder="Shop Email Address"
                                                        required
                                                        className="form-control"
                                                    />
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="loginName">
                                                        Shop Contact Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        onChange={handleInputChange}
                                                        name='mobile'
                                                        placeholder="Mobile Number"
                                                        required
                                                        className="form-control"
                                                    />
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="loginName">
                                                        Shop Description
                                                    </label>
                                                    <textarea className='form-control' onChange={handleInputChange} name="description" id="" cols="30" rows="10"></textarea>
                                                </div>


                                                <button className='btn btn-primary w-100' type="submit" disabled={isLoading}>
                                                    {isLoading ? (
                                                        <>
                                                            <span className="mr-2 ">Processing...</span>
                                                            <i className="fas fa-spinner fa-spin" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="mr-2 me-3">Create Shop</span>
                                                            <i className="fas fa-shop" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default VendorRegister