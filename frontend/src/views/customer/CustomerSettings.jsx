import React, {useState, useEffect} from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugins/UserData';
import Sidebar from './Sidebar';
import Toast from '../../utils/Toast';

const CustomerSettings = () => {
    const [profile, setProfile] = useState({});
    const userData = UserData();

    const fetchProfileData = async () => {
        await apiInstance.get(`user/profile/${userData?.user_id}/`)
        .then((res) => {
            setProfile(res.data);
        })
        .catch((err) => {
             console.log(err.message);
         })
    }

    const handleInputChange = (e) => {
        setProfile({
            ...profile,
             [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.files[0]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();;

        const res = await apiInstance.get(`user/profile/${userData?.user_id}/`)
        if(profile.image && profile.image !== res.data.image){
            formData.append('image', profile.image);
        }
        formData.append('full_name', profile.full_name);
        formData.append('address', profile.address);
        formData.append('state', profile.state);
        formData.append('city', profile.city);
        formData.append('country', profile.country);
        try {
            await apiInstance.patch(`user/profile/${userData?.user_id}/`, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })
            Toast.fire({
                icon: "success",
                title: "Profile updated successfully",
            })
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProfileData();
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
                        <div className="container px-4">
                            <section className="">
                            <h3 className="mb-3">
                                {" "}
                                <i className="fas fa-gear" /> Settings{" "}
                            </h3>
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-lg-12 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Profile Image
                                    </label>
                                    <input
                                    type="file"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    onChange={handleImageChange}
                                    name='image'
                                    />
                                </div>
                                <div className="col-lg-12 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Full Name
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.full_name}
                                    onChange={handleInputChange}
                                    name='full_name'
                                    />
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Email address
                                    </label>
                                    <input
                                    type="email"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.user?.email}
                                    readOnly
                                    />
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Mobile
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.user?.phone}
                                    readOnly
                                    />
                                </div>
                                </div>
                                <br />
                                <div className="row">
                                <div className="col-lg-6">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Address
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.address}
                                    onChange={handleInputChange}
                                    name='address'
                                    />
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    City
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.city}
                                    onChange={handleInputChange}
                                    name='city'
                                    />
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    State
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.state}
                                    onChange={handleInputChange}
                                    name='state'
                                    />
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                    >
                                    Country
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="emailHelp"
                                    value={profile.country}
                                    onChange={handleInputChange}
                                    name='country'
                                    />
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary mt-5">
                                Save Changes
                                </button>
                            </form>
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

export default CustomerSettings