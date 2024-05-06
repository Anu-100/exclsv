import React, { useState } from "react";
import apiInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setLoading(true)
    await apiInstance
      .get(`user/password-reset/${email}/`)
      .then(() => {
        alert("An email has been sent to you.");
        
      })
      .catch(() => {
        alert("Email does not exist");
      });
    setLoading(false);
  };

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
                    <h4 className="text-center">Forgot Password</h4>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <div>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">
                              Enter your registered email
                            </label>
                            <input
                              type="text"
                              id="username"
                              name="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {loading === true ? (
                            <button
                              disabled
                              className="btn btn-primary w-100 mb-3"
                              type="button"
                            >
                              <i className="fas fa-spinner fa-spin" />
                            </button>
                          ) : (
                            <button
                              onClick={handleEmailSubmit}
                              className="btn btn-primary w-100 mb-3"
                              type="button"
                            >
                              <span className="mr-2">Send Email</span>
                              <i className="fas fa-paper-plane ms-2" />
                            </button>
                          )}
                        </div>
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

export default ForgotPassword;
