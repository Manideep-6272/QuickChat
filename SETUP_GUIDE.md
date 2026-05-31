# QuickChat Application - Complete Setup & Deployment Guide

## Overview
QuickChat is a real-time chat application built with React (Frontend) and Node.js/Express (Backend), powered by Socket.IO for real-time messaging and MongoDB for data persistence.

## Technology Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Real-time Communication**: Socket.IO 4.x
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Real-time Client**: Socket.IO Client 4.x
- **Routing**: React Router v7
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons

## Prerequisites

Before running the application, ensure you have:
1. **Node.js** (v16+ recommended) - [Download](https://nodejs.org/)
2. **MongoDB** (Local or Cloud) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. **Cloudinary Account** - [Sign up](https://cloudinary.com/)
4. **npm** or **yarn** package manager

## Installation & Setup

### Step 1: Clone/Extract the Project
```bash
cd chat-app
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Configure Environment Variables
The `.env` file should already exist with the following variables:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL
CLIENT_URL=http://localhost:5173
```

**Important**: Replace placeholder values with your actual credentials.

#### 2.4 Start Backend Server
```bash
npm run dev
```

You should see:
```
Server started on port 5001
MongoDB connected
```

### Step 3: Frontend Setup

#### 3.1 Open New Terminal & Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Start Frontend Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Features Implemented

### ✅ User Authentication
- User Registration with validation
- Login with JWT tokens
- Logout functionality
- Session persistence
- Password hashing with bcryptjs

### ✅ Real-time Messaging (Socket.IO)
- **Instant Message Delivery**: Messages sent via both REST API and Socket.IO
- **Two-way Synchronization**: Messages saved to DB and delivered in real-time
- **Online Status Tracking**: See which users are currently online
- **Typing Indicators**: Get notified when someone is typing (prepared for UI integration)
- **Message History**: Load previous messages from database

### ✅ User Management
- User Profile Management
- Profile Picture Upload (via Cloudinary)
- User Bio & Name Updates
- View All Users
- Search Users (client-side filtering)

### ✅ Chat Interface
- Real-time chat container with auto-scroll
- Message timestamps
- Sender identification
- Online/Offline status indicators
- Message timestamps showing in conversation

### ✅ Technical Achievements
- CORS properly configured for Express + Socket.IO
- JWT authentication for Socket.IO connections
- Automatic socket reconnection
- Graceful error handling
- Real-time online users broadcast
- Scalable architecture

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   └── message.controller.js   # Message & user logic
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT verification
│   ├── models/
│   │   ├── user.model.js           # User schema
│   │   └── message.model.js        # Message schema
│   ├── routes/
│   │   ├── auth.route.js           # Auth endpoints
│   │   └── message.route.js        # Message endpoints
│   ├── lib/
│   │   ├── socket.js               # Socket.IO setup & events
│   │   ├── db.js                   # MongoDB connection
│   │   ├── cloudinary.js           # Image upload
│   │   └── utils.js                # JWT token generation
│   └── index.js                    # Main server file
├── .env                            # Environment variables
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatContainer.jsx       # Main chat interface
│   │   ├── SideBar.jsx             # User list & navigation
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── context/
│   │   ├── AuthContext.jsx         # Auth state management
│   │   └── SocketContext.jsx       # Socket.IO state management
│   ├── lib/
│   │   └── api.js                  # API calls
│   ├── pages/
│   │   ├── HomePage.jsx            # Chat page
│   │   ├── LoginPage.jsx           # Login
│   │   ├── RegisterPage.jsx        # Registration
│   │   └── ProfilePage.jsx         # User profile
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status
- `PUT /api/auth/updateProfile` - Update profile picture
- `PUT /api/auth/updateUserInfo` - Update name/bio

### Messaging
- `GET /api/message/users` - Get all users (except current user)
- `GET /api/message/:id` - Get messages with a user
- `POST /api/message/send/:id` - Send message

## Socket.IO Events

### Client → Server (Emit)
```javascript
// Send message
socket.emit("sendMessage", { receiverId, text, image })

// Typing indicators
socket.emit("userTyping", receiverId)
socket.emit("userStoppedTyping", receiverId)
```

### Server → Client (Listen)
```javascript
// Receive message
socket.on("receiveMessage", (messageData) => { ... })

// Online users list
socket.on("onlineUsers", (users) => { ... })

// Typing indicators
socket.on("userIsTyping", (data) => { ... })
socket.on("userStoppedTyping", (data) => { ... })

// Message confirmation
socket.on("messageSent", (messageData) => { ... })
socket.on("messageError", (error) => { ... })
```

## How Real-time Messaging Works

### Message Flow
1. User types message in frontend
2. Click send → API call to `POST /api/message/send/:id`
3. Backend saves message to MongoDB
4. Backend emits `receiveMessage` via Socket.IO to recipient
5. Backend sends `messageSent` confirmation to sender
6. Frontend updates UI with new message
7. If recipient is offline, message is stored in DB
8. When recipient comes online, historical messages are loaded

### Online Status Flow
1. User logs in → Socket.IO connects
2. Backend authenticates JWT token
3. User added to `userSocketMap`
4. `onlineUsers` event broadcast to all clients
5. Frontend displays online indicators on user list
6. User disconnects → removed from map
7. `onlineUsers` event broadcast again

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process on port 5001
# macOS/Linux:
lsof -ti:5001 | xargs kill -9

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

#### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Check MongoDB is running (if local)
- Verify network access (if MongoDB Atlas)
- Check credentials and IP whitelist

#### Socket.IO Connection Failed
- Ensure backend is running on port 5001
- Check CORS configuration
- Verify JWT token is being sent
- Check browser console for errors

### Frontend Issues

#### Socket.IO Not Connecting
1. Check if backend is running: `curl http://localhost:5001/health`
2. Check browser console for connection errors
3. Verify JWT cookie exists (DevTools → Application → Cookies)
4. Try clearing browser cache and cookies

#### Messages Not Sending
1. Check user is authenticated (check `/` page loads)
2. Verify Socket is connected (check browser console)
3. Check network tab in DevTools
4. Try sending via API first to test backend

#### Users Not Showing Online/Offline
1. Refresh page after another user logs in
2. Check Socket.IO listeners are set up
3. Verify online status is updating in console

## Testing the Application

### Manual Testing Checklist
- [ ] User Registration works
- [ ] User Login works
- [ ] User Logout works
- [ ] Profile page loads
- [ ] Profile picture upload works
- [ ] User list displays
- [ ] Online status updates
- [ ] Can send message and see in chat
- [ ] Recipient receives message in real-time
- [ ] Message history loads
- [ ] Search users works
- [ ] Can switch between chats

### Test Scenarios
1. **Single User Test**
   - Login with one user
   - Verify user list loads
   - Check online status shows

2. **Two User Test**
   - Open two browser windows (Chrome & Firefox)
   - Login with different users
   - Send messages back and forth
   - Verify real-time message delivery

3. **Online/Offline Test**
   - Login user A
   - See user A online in user B's list
   - Close user A's browser
   - Verify user A goes offline in user B's list

## Performance Optimization

### Current Optimizations
- ✅ Socket.IO connection pooling
- ✅ JWT caching in browser
- ✅ Message history pagination support
- ✅ Efficient online users tracking
- ✅ Database indexing on message queries

### Future Optimizations
- [ ] Implement message pagination
- [ ] Add message caching
- [ ] Implement read receipts
- [ ] Add typing timeout (already configured)
- [ ] Implement rate limiting
- [ ] Add message encryption

## Deployment

### Prerequisites for Production
1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Enable HTTPS for Socket.IO
4. Configure proper CORS origins
5. Use production MongoDB URI
6. Set secure JWT secret

### Deployment Services
- **Backend**: Heroku, Railway, Render
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary (already integrated)

## Security Considerations

### Current Security Measures
- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Socket.IO authentication middleware

### Recommended Enhancements
- [ ] Add rate limiting
- [ ] Implement message encryption
- [ ] Add input validation (backend)
- [ ] Use HTTPS only
- [ ] Implement API key authentication
- [ ] Add request signing
- [ ] Regular security audits

## Environment Variables Reference

```env
# Application
PORT                    # Server port (default: 5001)
NODE_ENV               # Environment (development/production)
CLIENT_URL             # Frontend URL for CORS

# Database
MONGODB_URI            # MongoDB connection string

# Authentication
JWT_SECRET             # Secret key for JWT signing

# File Upload
CLOUDINARY_CLOUD_NAME  # Cloudinary account name
CLOUDINARY_API_KEY     # Cloudinary API key
CLOUDINARY_API_SECRET  # Cloudinary API secret
```

## Support & Troubleshooting

If you encounter issues:
1. Check the browser console for errors
2. Check the server console logs
3. Verify all environment variables
4. Check network tab in DevTools
5. Try clearing cache and cookies
6. Restart both frontend and backend servers

## License
This project is created for educational purposes.

## Author
Built with passion for real-time communication! 🚀
