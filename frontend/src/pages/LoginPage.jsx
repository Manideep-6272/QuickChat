import React, { useState } from "react";
import quickchat from "../assets/logo_big.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.mobile || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      await login(formData.mobile, formData.password);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <h2 className="text-center mb-4 fw-bold">
                Login
              </h2>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

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
                  value={formData.mobile}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
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
              <button 
                type="submit"
                className="btn btn-primary btn-sm w-50 mx-auto d-block"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
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