const API_BASE_URL = "http://localhost:5001/api";

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for JWT authentication
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth endpoints
export const authAPI = {
  login: (credentials) => apiCall("/auth/login", "POST", credentials),
  signup: (userData) => apiCall("/auth/signup", "POST", userData),
  logout: () => apiCall("/auth/logout", "POST"),
  checkAuth: () => apiCall("/auth/check", "GET"),
  updateProfile: (profileData) => apiCall("/auth/updateProfile", "PUT", profileData),
  updateUserInfo: (userInfo) => apiCall("/auth/updateUserInfo", "PUT", userInfo),
};

// Message endpoints
export const messageAPI = {
  getUsers: () => apiCall("/message/users", "GET"),
  getMessages: (userId) => apiCall(`/message/${userId}`, "GET"),
  sendMessage: (userId, message) => apiCall(`/message/send/${userId}`, "POST", message),
};
