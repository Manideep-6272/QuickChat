import React from "react";
import quickchat from "../assets/logo_big.svg";
import { Link } from "react-router-dom";

function LoginPage() {
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

        {/* Right Side Login Form */}
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
              <h2 className="text-center mb-4 fw-bold">
                Login
              </h2>

              {/* Mobile Number */}
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Enter your registered mobile number
                </label>

                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Enter your password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-sm transparent-input mt-2"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="mb-4">
                <a
                  href="/forgot-password"
                  style={{
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <button className="btn btn-primary btn-sm w-50 mx-auto d-block">
                Login
              </button>

              {/* Register Link */}
              <div className="text-center mt-4">
                <span>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Register
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;