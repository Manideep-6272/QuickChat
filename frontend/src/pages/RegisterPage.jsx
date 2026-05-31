import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quickchat from "../assets/logo_big.svg";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    bio: "",
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
      // Validation
      if (!formData.mobile || !formData.name || !formData.bio || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Call signup
      await signup(formData.name, formData.mobile, formData.bio, formData.password);
      
      // Redirect to login page after successful registration
      navigate("/login", { 
        state: { message: "Registration successful! Please log in." } 
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            <form onSubmit={handleSubmit}>
              <h3 className="text-center mb-4 fw-bold">
                Register
              </h3>

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
                  value={formData.mobile}
                  onChange={handleChange}
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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.bio}
                  onChange={handleChange}
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
                  className="form-control form-control-sm transparent-input mt-2"
                  value={formData.password}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              {/* Button */}
              <button 
                type="submit"
                className="btn btn-primary btn-sm w-50 mx-auto d-block"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
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