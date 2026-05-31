# Chat App - Full Frontend/Backend Integration Guide

## Overview
This document outlines the complete authentication and messaging system integration between the frontend and backend of the chat application.

## Features Implemented

### 1. **Authentication Flow**
- ✅ User Registration (redirects to Login page after successful registration)
- ✅ User Login (redirects to Home page after successful login)
- ✅ Session Persistence (automatically logs in on app restart if previously logged in)
- ✅ Logout functionality (clears session and redirects to Login)
- ✅ Protected Routes (non-authenticated users redirected to login)

### 2. **User Management**
- ✅ Display list of all users (excluding current user) in sidebar
- ✅ Fetch user profiles with names, bios, and profile pictures
- ✅ Update profile picture functionality

### 3. **Messaging**
- ✅ Fetch messages between users
- ✅ Send messages (HTTP POST requests)
- ✅ Display messages properly (sent vs received)
- ✅ Real-time updates ready for Socket.io (you can add Socket.io for real-time messaging)

### 4. **UI/UX**
- ✅ Authentication pages styled with glassmorphism
- ✅ Chat interface with sidebar and chat container
- ✅ User list with online status indicators
- ✅ Message display with sender/receiver differentiation

---

## Project Structure

### Frontend (React + Vite)
```
src/
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── components/
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   ├── SideBar.jsx              # Users list & navigation
│   └── ChatContainer.jsx        # Message display & input
├── pages/
│   ├── LoginPage.jsx            # Login form
│   ├── RegisterPage.jsx         # Registration form
│   ├── HomePage.jsx             # Main chat interface
│   └── ProfilePage.jsx          # User profile management
├── lib/
│   └── api.js                   # API calls & endpoints
└── main.jsx                     # App entry point with AuthProvider
```

### Backend (Node.js + Express)
```
src/
├── routes/
│   ├── auth.route.js            # /api/auth/* endpoints
│   └── message.route.js         # /api/message/* endpoints
├── controllers/
│   ├── auth.controller.js       # Authentication logic
│   └── message.controller.js    # Messaging logic
├── middleware/
│   └── auth.middleware.js       # JWT verification
├── models/
│   ├── user.model.js            # User schema
│   └── message.model.js         # Message schema
├── lib/
│   ├── db.js                    # Database connection
│   ├── utils.js                 # JWT generation
│   └── cloudinary.js            # Image upload
└── index.js                     # Server setup with CORS
```

---

## How It Works

### 1. **Authentication Flow**

#### Registration
1. User fills registration form (name, mobile, bio, password)
2. Sends POST request to `/api/auth/signup`
3. Backend validates and creates user
4. User is redirected to login page

#### Login
1. User enters mobile and password
2. Sends POST request to `/api/auth/login`
3. Backend validates credentials and sends JWT cookie
4. Frontend stores auth state
5. User redirected to home page

#### Session Persistence
1. AuthContext checks user on app load with `/api/auth/check`
2. If JWT cookie is valid, user is kept logged in
3. If invalid/expired, user redirected to login
4. This happens automatically on every page refresh

### 2. **Data Flow**

**Frontend → Backend:**
- Uses `fetch` API with `credentials: 'include'` to send cookies
- All requests go to `http://localhost:5001/api/*`
- CORS is configured to allow frontend requests

**Backend → Frontend:**
- Returns JSON responses
- Sets JWT in HTTP-only cookie (secure, can't be accessed by JS)
- Cookie automatically included in all subsequent requests

### 3. **Component Communication**

```
App.jsx
├── AuthProvider (wraps entire app with auth context)
├── ProtectedRoute (checks isAuthenticated)
└── Routes
    ├── / (HomePage - protected)
    ├── /profile (ProfilePage - protected)
    ├── /login (LoginPage - redirects if authenticated)
    └── /register (RegisterPage - redirects if authenticated)
```

---

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup
- Body: { name, mobile, bio, password }
- Returns: User object

POST /api/auth/login
- Body: { mobile, password }
- Returns: User object
- Sets: JWT cookie

GET /api/auth/check
- Protected: Yes (requires JWT)
- Returns: Current user object

POST /api/auth/logout
- Protected: Yes
- Returns: Success message
- Clears: JWT cookie

PUT /api/auth/updateProfile
- Protected: Yes
- Body: { profilepic }
- Returns: Updated user object
```

### Message Endpoints
```
GET /api/message/users
- Protected: Yes
- Returns: Array of all users (except current user)

GET /api/message/:id
- Protected: Yes
- Returns: Array of messages with specified user

POST /api/message/send/:id
- Protected: Yes
- Body: { text, image (optional) }
- Returns: Created message object
```

---

## Setup Instructions

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file:**
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   - By default runs on `http://localhost:5173`

---

## Key Implementation Details

### 1. **CORS Configuration**
- Backend allows requests from `http://localhost:5173`
- Cookies are allowed (credentials: true)
- Preflight OPTIONS requests are handled

### 2. **Cookie Handling**
- JWT stored in HTTP-only cookie (set by backend)
- Automatically sent with every request using `credentials: 'include'`
- Cannot be accessed by JavaScript (secure)
- Cleared on logout

### 3. **Protected Routes**
- ProtectedRoute component wraps protected pages
- Checks `isAuthenticated` from AuthContext
- Shows loading spinner while auth is being verified
- Redirects to login if not authenticated

### 4. **Auth Context**
- Manages global authentication state
- Provides: user, isAuthenticated, loading, login, logout, signup functions
- Automatically checks auth on app load
- Used throughout app via `useAuth()` hook

---

## Testing the Flow

### 1. **Test Registration & Login**
```
1. Go to http://localhost:5173/register
2. Fill form (mobile must be unique)
3. Click Register
4. Redirected to /login
5. Enter mobile and password
6. Click Login
7. Redirected to / (homepage)
```

### 2. **Test Session Persistence**
```
1. Log in successfully
2. Close browser tab/window
3. Open browser again to http://localhost:5173
4. Should automatically redirect to / (still logged in)
5. User info should be loaded
```

### 3. **Test Logout**
```
1. Click menu (⋮) in sidebar
2. Click "Logout"
3. Should redirect to /login
4. Session is cleared
```

### 4. **Test Messaging**
```
1. Sidebar shows list of users
2. Click on a user
3. Messages between users appear (if any)
4. Type message and send
5. Message appears in chat
```

---

## Socket.io Integration Ready

The messaging infrastructure is ready for Socket.io:

1. **What to add:**
   ```javascript
   // In frontend main.jsx
   import io from 'socket.io-client';
   
   const socket = io('http://localhost:5001');
   
   // Listen for new messages
   socket.on('newMessage', (message) => {
     setMessages([...messages, message]);
   });
   
   // Emit send message
   socket.emit('sendMessage', { receiverId, text });
   ```

2. **In backend index.js:**
   ```javascript
   import { Server } from 'socket.io';
   
   const io = new Server(app, {
     cors: { origin: "http://localhost:5173" }
   });
   
   io.on('connection', (socket) => {
     // Handle real-time messaging
   });
   ```

---

## Common Issues & Solutions

### Issue: "CORS error" or "No 'Access-Control-Allow-Origin' header"
**Solution:** 
- Ensure backend CORS middleware is set up correctly
- Frontend must use `credentials: 'include'` in fetch
- Both should use correct URLs (localhost:5173 for frontend, localhost:5001 for backend)

### Issue: "Cookies not being sent"
**Solution:**
- Check that API calls use `credentials: 'include'`
- Backend must set credentials policy to true
- Browser must allow third-party cookies (local dev usually fine)

### Issue: "User stays logged out after page refresh"
**Solution:**
- Check that AuthContext useEffect runs on mount
- Verify `/api/auth/check` endpoint works
- Check browser console for network errors

### Issue: "Cannot read property of undefined" in messages
**Solution:**
- Ensure `currentUser` from useAuth is available
- Check that senderId matches userId format in database
- Verify message objects have all required fields

---

## Next Steps

1. **Add Socket.io for real-time messaging** (you mentioned you'll do this)
2. **Add password reset functionality**
3. **Add user search/filter in sidebar**
4. **Add typing indicators**
5. **Add message read receipts**
6. **Add image sharing in messages**
7. **Add group chats**
8. **Deploy to production**

---

## Files Modified/Created

### Frontend Files Created:
- `src/context/AuthContext.jsx` - Authentication state
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/lib/api.js` - API utility functions

### Frontend Files Modified:
- `src/main.jsx` - Added AuthProvider
- `src/App.jsx` - Added protected routes and redirects
- `src/pages/LoginPage.jsx` - Added login form submission
- `src/pages/RegisterPage.jsx` - Added registration form submission
- `src/pages/ProfilePage.jsx` - Added profile display and updates
- `src/components/SideBar.jsx` - Added fetch users and logout
- `src/components/ChatContainer.jsx` - Added message fetch and send

### Backend Files Modified:
- `src/index.js` - Added CORS middleware
- `src/controllers/message.controller.js` - Fixed function name (getusersForSideBar → getUsersForSideBar)

---

## Support

For issues or questions, check:
1. Browser console for JavaScript errors
2. Network tab for API requests
3. Backend console for server errors
4. CORS headers in response
5. JWT cookie in browser DevTools → Application → Cookies

---

**Happy coding! 🚀**
