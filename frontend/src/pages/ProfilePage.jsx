import React from "react";

function ProfilePage() {
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

            {/* Profile Photo */}
            <div className="d-flex flex-column align-items-center mb-4">

              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #8b5cf6",
                }}
              >
                <img
                  src="https://i.pravatar.cc/300"
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
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
                />
              </label>
            </div>

            {/* Form */}
            <form>

              {/* Full Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  className="form-control form-control-sm transparent-input mt-2"
                  defaultValue="Manideep"
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
                  defaultValue="9948654190"
                  readOnly
                />
              </div>

              {/* Bio */}
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>

                <input
                  type="text"
                  id="bio"
                  className="form-control form-control-sm transparent-input mt-2"
                  defaultValue="Busy"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Change Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="form-control form-control-sm transparent-input mt-2"
                  placeholder="Enter new password"
                />
              </div>

              {/* Update Button */}
              <button className="btn btn-primary btn-sm w-50 mx-auto d-block">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;