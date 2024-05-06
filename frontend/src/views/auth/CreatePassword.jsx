import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";

const CreatePassword = () => {
    const [ password, setPassword ] = useState("")
    const [ confirmedPassword, setConfirmedPassword ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ searchParams ] = useSearchParams()
    const otp = searchParams.get("otp")
    const uidb64 = searchParams.get("uidb64")

    const navigate = useNavigate()

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(password !== confirmedPassword){
            alert("Passwords do not match.")
        }
        else{
            const formData = new FormData()
            formData.append("password",password);
            formData.append("otp",otp);
            formData.append("uidb64",uidb64);

            await apiInstance.post('user/password-change/', formData)
            .then((res) => {
                alert("Password changed successfully!")
                navigate("/login")
            })
            .catch(() => {
                alert("An error has occured while trying to change the password!")
            })
        }
        setLoading(false)
    }
    return (
        <div>
            <main className="" style={{ marginBottom: "100px", marginTop: "50px" }}>
                <div className="container">
                {/* Section: Login form */}
                <section className="">
                    <div className="row d-flex justify-content-center">
                    <div className="col-xl-5 col-md-8">
                        <div className="card rounded-5">
                        <div className="card-body p-4">
                            <h4 className="text-center">Create a new Password</h4>
                            <br />

                            <div className="tab-content">
                            <div
                                className="tab-pane fade show active"
                                id="pills-login"
                                role="tabpanel"
                                aria-labelledby="tab-login"
                            >
                                <form onSubmit={handlePasswordSubmit}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginPassword">
                                    Enter a new password
                                    </label>
                                    <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginPassword">
                                    Confirm new password
                                    </label>
                                    <input
                                    type="password"
                                    id="confirm-password"
                                    name="password"
                                    className="form-control"
                                    value={confirmedPassword}
                                    onChange={(e) => setConfirmedPassword(e.target.value)}
                                    />
                                </div>
                                {loading === true ? (
                                    <button
                                    disabled
                                    className="btn btn-primary w-100 mb-3"
                                    type="submit"
                                    > 
                                    <i className="fas fa-spinner fa-spin"/>                                   
                                   </button>
                                ) : (
                                    <button
                                    className="btn btn-primary w-100 mb-3"
                                    type="submit"
                                    >
                                    <span className="mr-2">Save Password</span>                               
                                    </button>
                                )}
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
        </div>
    );
};

export default CreatePassword;
