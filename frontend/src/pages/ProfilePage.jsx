import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.profilepic || null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Update profile picture if changed
      if (previewImage && previewImage !== user?.profilepic) {
        await updateProfile({ profilepic: previewImage });
      }

      // Update user info (name and bio) if changed
      const updates = {};
      if (formData.name.trim() !== (user?.name || "")) {
        updates.name = formData.name.trim();
      }
      if (formData.bio.trim() !== (user?.bio || "")) {
        updates.bio = formData.bio.trim();
      }

      if (Object.keys(updates).length > 0) {
        await updateUserInfo(updates);
      }

      setSuccess("Profile updated successfully!");
      setHasChanges(false);

      // Redirect back after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="col-md-5 text-center">
            <p style={{ color: "#9ca3af" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row vh-100 align-items-center justify-content-center">

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
            {/* Heading */}
            <h2 className="text-center fw-bold mb-4">
              Profile
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

            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {success}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSuccess("")}
                ></button>
              </div>
            )}

            {/* Profile Photo */}
            <div className="d-flex flex-column align-items-center mb-4">

              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #8b5cf6",
                  backgroundImage: previewImage ? `url(${previewImage})` : "linear-gradient(135deg,#7c3aed,#2563eb)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#111827",
                }}
              >
                {!previewImage && (
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              {/* Upload Button */}
              <label
                className="btn btn-sm btn-outline-light mt-3"
                style={{
                  cursor: "pointer",
                }}
              >
                Change Photo

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control form-control-sm transparent-input mt-2"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Mobile Number
                </label>

                <input
                  type="text"
                  id="mobile"
                  className="form-control form-control-sm transparent-input mt-2"
                  value={user.mobile}
                  readOnly
                  disabled
                />
                <small style={{ color: "#9ca3af" }}>Cannot be changed</small>
              </div>

              {/* Bio */}
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  className="form-control form-control-sm transparent-input mt-2"
                  value={formData.bio}
                  onChange={handleFormChange}
                  rows="3"
                  maxLength="200"
                />
                <small style={{ color: "#9ca3af" }}>
                  {formData.bio.length}/200
                </small>
              </div>

              {/* Update Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-sm w-50 mx-auto d-block"
                disabled={loading || !hasChanges}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              {/* Back Button */}
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm w-50 mx-auto d-block mt-2"
                onClick={() => navigate("/")}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;