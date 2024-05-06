import React, { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { userAuthStore } from "../../store/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = userAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await login(email, password);
    if (error) {
      alert(JSON.stringify(error));
    } else {
      navigate("/");
      resetForm();
      setLoading(false);
    }
    setLoading(false)
  };

  return (
    <>
      <main className="" style={{ marginBottom: 100, marginTop: 100 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Login</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleLogin}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">
                              Email
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

                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Password
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

                          {loading === true 
                              ? (<button disabled
                                className="btn btn-primary w-100"
                                type="submit"
                                  >
                                <i className="fas fa-spinner fa-spin"/>
                                </button>)
                              : (<button
                                className="btn btn-primary w-100"
                                type="submit"
                                  >
                                <span className="mr-2">Sign In</span>
                                </button>)
                            }

                          <div className="text-center">
                            <p className="mt-4">
                              Don't have an account?{" "}
                              <Link to="/register">Register</Link>
                            </p>
                            <p className="mt-0">
                              <Link
                                to="/forgot-password"
                                className="text-primary"
                              >
                                Forgot Password?
                              </Link>
                            </p>
                          </div>
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
    </>
  );
};

export default Login;
