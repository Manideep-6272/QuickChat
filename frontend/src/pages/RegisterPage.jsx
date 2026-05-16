import React from "react";
import { Link } from "react-router-dom";
import quickchat from "../assets/logo_big.svg";

const RegisterPage = () => {
  return (
    <div className="container">
      <div className="row vh-100 align-items-center justify-content-center">
        
        {/* Left Side Logo */}
        <div className="col-md-5 text-center">
          <img
            src={quickchat}
            alt="QuickChat"
            className="img-fluid"
            style={{ maxWidth: "300px" }}
          />
        </div>

        {/* Right Side Form */}
        <div className="col-md-5">
          <div
            className="shadow rounded"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "30px",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <form>
              <h3 className="text-center mb-4 fw-bold">
                Register
              </h3>

              {/* Mobile */}
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Enter your mobile number
                </label>

                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Enter your full name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Bio */}
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  About yourself
                </label>

                <input
                  type="text"
                  id="bio"
                  name="bio"
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Set your password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  maxLength={10}
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Button */}
              <button className="btn btn-primary btn-sm w-50 mx-auto d-block">
                Register
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <span>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;