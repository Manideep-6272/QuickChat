# Socket.IO Implementation Verification Checklist

## 🔍 Pre-Launch Verification

Use this checklist to ensure everything is properly configured before running the application.

---

## ✅ Backend Setup Verification

### 1. Environment Variables
```bash
# In backend/.env - Verify these exist:
- PORT=5001                                    ✓
- NODE_ENV=development                        ✓
- MONGODB_URI=mongodb+srv://...               ✓
- JWT_SECRET=mysecretkey                      ✓
- CLOUDINARY_CLOUD_NAME=...                   ✓
- CLOUDINARY_API_KEY=...                      ✓
- CLOUDINARY_API_SECRET=...                   ✓
- CLIENT_URL=http://localhost:5173            ✓
```

### 2. Dependencies Installed
```bash
cd backend
npm list socket.io
npm list express
npm list mongoose
npm list jsonwebtoken
npm list bcryptjs
npm list cloudinary
```

**Expected Output:** All should show version 4.8.3 for socket.io

### 3. Socket.IO File Check
```bash
# Verify file exists and has correct content:
ls -la backend/src/lib/socket.js

# Should contain:
# ✓ import { Server } from "socket.io"
# ✓ JWT authentication middleware
# ✓ userSocketMap object
# ✓ "connection" event handler
# ✓ "sendMessage" event handler
# ✓ "disconnect" event handler
# ✓ getSocketIdForUser export
```

### 4. Controller Updates
```bash
# Verify message controller has Socket.IO integration:
grep -n "sendMessage" backend/src/controllers/message.controller.js

# Should contain:
# ✓ import { io, getSocketIdForUser } from socket.js
# ✓ io.to(receiverSocketId).emit("receiveMessage", ...)
# ✓ Socket.IO emit in sendMessage function
```

### 5. CORS Configuration
```bash
# Verify index.js has proper CORS:
grep -A 5 "cors({" backend/src/index.js

# Should show:
# ✓ origin: process.env.CLIENT_URL
# ✓ credentials: true
# ✓ methods: ["GET", "POST", "PUT", "DELETE"]
```

---

## ✅ Frontend Setup Verification

### 1. Socket Context Exists
```bash
# File should exist:
ls -la frontend/src/context/SocketContext.jsx

# Should contain:
# ✓ import io from "socket.io-client"
# ✓ useSocket hook
# ✓ SocketProvider component
# ✓ Socket event listeners setup
```

### 2. Main.jsx Updated
```bash
# Verify SocketProvider is imported and used:
grep -n "SocketProvider" frontend/src/main.jsx

# Should show:
# ✓ import { SocketProvider }
# ✓ <SocketProvider> wrapper around App
```

### 3. Components Updated
```bash
# ChatContainer should have Socket integration:
grep -n "useSocket" frontend/src/components/ChatContainer.jsx
# Should show: ✓ import and useSocket hook

# SideBar should show online status:
grep -n "isUserOnline" frontend/src/components/SideBar.jsx
# Should show: ✓ isUserOnline usage

# Both should show:
# ✓ import { useSocket }
# ✓ const { ... } = useSocket()
```

### 4. Dependencies Installed
```bash
cd frontend
npm list socket.io-client
npm list react-router-dom
npm list react

# Expected: socket.io-client version 4.8.3
```

---

## 🚀 Launch & Connection Verification

### Step 1: Start Backend
```bash
cd backend
npm run dev

# Expected Output:
# [nodemon] restarting due to changes...
# [nodemon] starting `node src/index.js`
# Server started on port 5001      ← ✓ This must appear
# MongoDB connected                 ← ✓ Or "MongoDB not connected" error
```

**If MongoDB error:**
- Check MONGODB_URI in .env is correct
- Verify network access in MongoDB Atlas
- Check IP whitelist if using cloud

### Step 2: Start Frontend
```bash
cd frontend
npm run dev

# Expected Output:
# VITE v8.0.12  ready in 123 ms
# ➜  Local:   http://localhost:5173/   ← ✓ Click this link
```

### Step 3: Open Browser & Check Console
1. Open `http://localhost:5173`
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Check for these messages:

✓ No red errors
✓ "Socket connected: xxxxx" (if logged in)
✓ No CORS errors
✓ No "Cannot find module" errors

**If Errors:**
- Check backend is running on port 5001
- Verify socket URL in SocketContext matches
- Check CORS headers in network tab

---

## 🧪 Runtime Verification Tests

### Test 1: User Registration
1. Click "Register"
2. Fill form with new mobile number
3. Submit
4. **Expected:** Redirected to login page

**Backend Console Should Show:**
```
POST /api/auth/signup 201
```

### Test 2: User Login & Socket Connection
1. Enter credentials
2. Click "Login"
3. **Expected:** Redirected to home page
4. **Browser Console Should Show:**
   ```
   Socket connected: [socket-id]
   Online users update: [...]
   ```

### Test 3: See Other Users
1. Login as User 1
2. Sidebar shows list of other users
3. Each user shows online status (green dot)
4. **Expected:** Online indicator visible

### Test 4: Send Message (Single User)
1. Click on any user
2. Type message "Hello"
3. Click Send
4. **Expected:** Message appears in chat

**Backend Console Should Show:**
```
User in sendMessage controller
Message saved to DB
[socket emit event]
```

**Browser Console Should Show:**
```
messageSent event received
```

### Test 5: Real-Time Message (Two Browsers)
1. **Browser 1 (Chrome):** Login as User A
2. **Browser 2 (Firefox):** Login as User B
3. **Browser 1:** Click on User B
4. **Browser 2:** Click on User A
5. **Browser 1:** Send message "Hi B!"
6. **Expected in Browser 2:** Message appears INSTANTLY

**Both Browser Consoles Should Show:**
```
receiveMessage event received
```

### Test 6: Online Status Update
1. **Browser 2:** Close window
2. **Browser 1:** Observe User B's status
3. **Expected:** Changes from Green to Gray
4. **Browser 1 Console Should Show:**
   ```
   onlineUsers update: [...]  (User B removed)
   ```

### Test 7: Message History
1. Both browsers send 5 messages
2. **Browser 1:** Switch to different user
3. **Browser 1:** Switch back to User B
4. **Expected:** All 5 messages still visible with timestamps

---

## 🔧 Debug Commands

### Backend Debug
```bash
# Check if port 5001 is listening
lsof -i :5001              (Mac/Linux)
netstat -ano | findstr :5001  (Windows)

# Check Node processes
ps aux | grep node         (Mac/Linux)
tasklist | findstr node    (Windows)

# Check MongoDB connection
npm run dev 2>&1 | grep -i mongo

# View full backend logs
npm run dev

# Kill backend if stuck
kill -9 [PID]              (Mac/Linux)
taskkill /PID [PID] /F     (Windows)
```

### Frontend Debug
```bash
# Check Node processes
ps aux | grep vite         (Mac/Linux)

# Check if port 5173 is listening
lsof -i :5173              (Mac/Linux)

# Clear npm cache if modules issue
npm cache clean --force
rm -rf node_modules
npm install
```

### Network Debug
```bash
# From terminal, test backend is running
curl http://localhost:5001/health

# Expected Response:
# {"message":"Server is running"}

# Test Socket connection
# (Open browser console and check for connection message)
```

---

## 📋 Browser Developer Tools Checklist

### Console Tab (F12 → Console)
- [ ] No red errors on page load
- [ ] "Socket connected: [id]" message visible after login
- [ ] "Online users update: [...]" message visible
- [ ] No CORS errors
- [ ] No module not found errors

### Network Tab (F12 → Network)
- [ ] GET `/` returns 200
- [ ] POST `/api/auth/login` returns 200
- [ ] GET `/api/message/users` returns 200
- [ ] WebSocket (WS) connection visible
- [ ] No 404 or 500 errors

### Application Tab (F12 → Application)
- [ ] Cookies section shows "jwt" cookie
- [ ] JWT cookie contains token value
- [ ] Cookies set with httpOnly flag

### Socket.IO Specific (Console)
```javascript
// Try this in console to check socket:
console.log(window.io)     // Should show Socket.IO library loaded

// Or if context is available:
// Check component props for socket object
```

---

## 🐛 Common Issues & Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| Socket not connecting | Backend running? | Start backend: `npm run dev` |
| | Port 5001 available? | `lsof -i :5001` to find process |
| | CORS error in console? | Check CORS in index.js |
| | JWT token missing? | Login again, check cookies |
| Messages not sending | MongoDB running? | Check connection string |
| | Backend errors? | Check backend console |
| | Socket connected? | Check console for connection msg |
| Online status not updating | Socket events firing? | Check console logs |
| | Page needs refresh? | Refresh browser |
| | Both users logged in? | Check both browsers |

---

## ✅ Final Pre-Launch Checklist

Before considering the implementation complete:

### Code Quality
- [ ] No console errors in browser
- [ ] No red errors in backend console
- [ ] All files properly imported
- [ ] No undefined variables

### Functionality
- [ ] Registration works
- [ ] Login works
- [ ] Socket connects after login
- [ ] Messages send and receive
- [ ] Online status updates
- [ ] Can logout

### Performance
- [ ] Messages deliver in < 1 second
- [ ] Online status updates instantly
- [ ] No memory leaks
- [ ] Smooth scrolling in chat

### Security
- [ ] JWT token in httpOnly cookies
- [ ] No sensitive data in console
- [ ] CORS configured properly
- [ ] Socket authenticated

---

## 📊 Expected Browser Console Output

### After Login (Success Case)
```
[Socket.IO] 1 websocket transport
Socket connected: sk_aB1cD2e3F4g5H6i7J8k9
Online users update: ['userId1', 'userId2', 'userId3']
```

### After Sending Message (Success Case)
```
messageSent event received
receiveMessage event received
```

### After User Goes Offline
```
onlineUsers update: ['userId2']  (userId1 removed)
```

---

## 🎯 Success Indicators

Your Socket.IO implementation is working if:

✅ Browser shows "Socket connected: [id]"
✅ Online users list updates in real-time
✅ Messages appear without page refresh
✅ Online/offline status changes instantly
✅ No console errors
✅ Can send/receive messages between browsers
✅ Message history persists
✅ Session persists on page refresh

---

## 📞 If Issues Persist

1. **Check All 3 Guides:**
   - SETUP_GUIDE.md (Comprehensive)
   - QUICK_START_GUIDE.md (Quick test)
   - SOCKET_IO_IMPLEMENTATION.md (Technical details)

2. **Verify Environment:**
   - .env file has all required variables
   - MongoDB is accessible
   - Ports 5001 and 5173 are free
   - Node.js version is 16+

3. **Check Error Messages:**
   - Browser console (F12)
   - Backend terminal
   - Network tab (F12)

4. **Try Fresh Start:**
   - Stop both servers (Ctrl+C)
   - `npm cache clean --force`
   - `npm install` in both directories
   - Start backend, then frontend

---

**Implementation Status: ✅ COMPLETE & READY TO TEST**

🚀 Ready to run your real-time chat application!
