# Authentication & Messaging Flow Diagrams

## 1. Application Startup Flow

```
App Starts
    ↓
AuthProvider initializes
    ↓
useEffect: Check Auth Status
    ↓
Call /api/auth/check
    ↓
    ├─→ JWT valid? → Yes → Set user data → isAuthenticated = true
    │
    └─→ JWT valid? → No → Set user = null → isAuthenticated = false
    ↓
App.jsx receives isAuthenticated
    ↓
    ├─→ isAuthenticated = true → Redirect to / (HomePage)
    │
    └─→ isAuthenticated = false → Redirect to /login (LoginPage)
```

## 2. User Registration Flow

```
User on /register page
    ↓
Fill registration form (name, mobile, bio, password)
    ↓
Click "Register" button
    ↓
handleSubmit validates form
    ↓
Call signup(name, mobile, bio, password)
    ↓
authAPI.signup() makes POST to /api/auth/signup
    ↓
Backend creates user (hashes password)
    ↓
Returns user object
    ↓
Frontend navigates to /login
    ↓
Show success message: "Registration successful! Please log in."
```

## 3. User Login Flow

```
User on /login page
    ↓
Fill login form (mobile, password)
    ↓
Click "Login" button
    ↓
handleSubmit validates form
    ↓
Call login(mobile, password)
    ↓
authAPI.login() makes POST to /api/auth/login
    ├─ credentials: 'include' (send cookies)
    ├─ Content-Type: application/json
    └─ Body: { mobile, password }
    ↓
Backend validates credentials
    ↓
Backend generates JWT token
    ↓
Backend sets Set-Cookie header with JWT
    ↓
Frontend receives response + JWT cookie
    ↓
Frontend updates AuthContext:
    ├─ setUser(userData)
    └─ setIsAuthenticated(true)
    ↓
Frontend navigates to / (HomePage)
    ↓
User is now logged in!
```

## 4. Session Persistence Flow

```
User closes browser (while logged in)
    ↓
Browser keeps JWT cookie (if not expired)
    ↓
User opens browser again
    ↓
Visit http://localhost:5173
    ↓
App component loads → AuthContext initializes
    ↓
useEffect runs on mount
    ↓
Call authAPI.checkAuth()
    ├─ credentials: 'include' (sends JWT cookie automatically)
    └─ GET /api/auth/check
    ↓
Backend receives request
    ↓
Middleware extracts JWT from cookie
    ↓
Validates JWT
    ↓
    ├─→ Valid? → Returns user object
    │
    └─→ Invalid/Expired? → Returns error
    ↓
    ├─→ User received → setUser() → isAuthenticated = true
    │
    └─→ Error received → setUser(null) → isAuthenticated = false
    ↓
    ├─→ isAuthenticated = true → Redirects to / (stays logged in!)
    │
    └─→ isAuthenticated = false → Redirects to /login
```

## 5. Logout Flow

```
User clicks menu button (⋮) in sidebar
    ↓
User clicks "Logout"
    ↓
handleLogout() executes
    ↓
Call logout()
    ↓
authAPI.logout() makes POST to /api/auth/logout
    ├─ credentials: 'include' (sends JWT cookie)
    └─ POST /api/auth/logout
    ↓
Backend clears JWT cookie
    ├─ Sets: Set-Cookie: jwt=; maxAge=0
    └─ Cookie deleted from browser
    ↓
Frontend updates AuthContext:
    ├─ setUser(null)
    └─ setIsAuthenticated(false)
    ↓
Frontend navigates to /login
    ↓
User session is cleared!
```

## 6. Message Sending Flow

```
User selects a chat (clicks on user in sidebar)
    ↓
ChatContainer loads for selectedChat
    ↓
useEffect fetches messages:
    ├─ Call messageAPI.getMessages(userId)
    ├─ GET /api/message/:id
    ├─ credentials: 'include' (sends JWT)
    └─ Backend returns array of messages
    ↓
Messages displayed in chat
    ↓
User types message and clicks send
    ↓
handleSendMessage(e) executes
    ↓
Form validates message text
    ↓
Call messageAPI.sendMessage(userId, { text })
    ├─ POST /api/message/send/:id
    ├─ credentials: 'include'
    └─ Body: { text: "Hello!" }
    ↓
Backend:
    ├─ Extract senderId from JWT (req.user._id)
    ├─ Extract receiverId from URL params
    ├─ Create new Message document
    └─ Save to database
    ↓
Backend returns created message object
    ↓
Frontend adds message to messages array
    ↓
Message appears in chat instantly!
    ↓
Can now implement Socket.io to auto-update receiver's chat
```

## 7. Protected Route Flow

```
User tries to access /profile
    ↓
App.jsx has:
    <Route path="/profile" 
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    ↓
ProtectedRoute component checks:
    ├─ const { isAuthenticated, loading } = useAuth()
    └─ const { loading } → Show spinner
    ↓
    ├─→ loading = true → Show spinner
    │
    ├─→ isAuthenticated = true → Render ProfilePage
    │
    └─→ isAuthenticated = false → Redirect to /login
    ↓
    ├─→ Authenticated user → Sees ProfilePage
    │
    └─→ Unauthenticated user → Redirected to /login
```

## 8. API Call Flow with CORS & Cookies

```
Frontend makes API call
    ↓
fetch(URL, {
  method: 'GET/POST/PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  ← This sends cookies!
  body: JSON.stringify(data)
})
    ↓
Browser includes JWT cookie in request headers:
    Cookie: jwt=eyJhbGc...
    ↓
Request travels over network to backend:5001
    ↓
Backend CORS middleware checks:
    ├─ Origin: http://localhost:5173 ✓ Allowed
    ├─ credentials: true ✓ Allowed
    └─ Method: GET/POST/PUT ✓ Allowed
    ↓
Request allowed through CORS
    ↓
Backend routes request to appropriate controller
    ↓
protectRoute middleware:
    ├─ Extract JWT from req.cookies.jwt
    ├─ Verify JWT with JWT_SECRET
    ├─ Extract userId from JWT
    └─ Fetch user from database
    ↓
If valid → req.user set → Controller executes
If invalid → Return 401 error
    ↓
Controller processes request
    ↓
Backend sends response + Set-Cookie header (if needed)
    ↓
Response received by frontend
    ↓
JavaScript processes response
    ↓
Update UI or state
```

## 9. State Management Flow

```
AuthContext.jsx provides:

┌─────────────────────────────────┐
│   AuthContext (Global State)     │
├─────────────────────────────────┤
│ user: { _id, name, mobile... }  │
│ isAuthenticated: true/false     │
│ loading: true/false             │
│ login()                         │
│ signup()                        │
│ logout()                        │
│ updateProfile()                 │
└─────────────────────────────────┘
    ↓
Used by hooks:
    ├─ const { user } = useAuth()
    ├─ const { isAuthenticated } = useAuth()
    ├─ const { logout } = useAuth()
    └─ const { updateProfile } = useAuth()
    ↓
Available in:
    ├─ LoginPage.jsx
    ├─ RegisterPage.jsx
    ├─ ProfilePage.jsx
    ├─ SideBar.jsx
    ├─ ChatContainer.jsx
    └─ ProtectedRoute.jsx
    ↓
When context updates:
    ├─ All connected components re-render
    └─ UI updates automatically
```

## 10. Request/Response Cycle

```
Frontend Request:
┌──────────────────────────────┐
│ POST /api/auth/login         │
├──────────────────────────────┤
│ Headers:                     │
│ - Content-Type: application/ │
│   json                       │
│ - Cookie: jwt=...            │
├──────────────────────────────┤
│ Body:                        │
│ {                            │
│   "mobile": "9876543210",    │
│   "password": "pass123"      │
│ }                            │
└──────────────────────────────┘
    ↓
Backend processes request
    ↓
Backend Response:
┌──────────────────────────────┐
│ Status: 201 Created          │
├──────────────────────────────┤
│ Headers:                     │
│ - Set-Cookie: jwt=...;       │
│   HttpOnly; Path=/           │
│ - Content-Type: application/ │
│   json                       │
├──────────────────────────────┤
│ Body:                        │
│ {                            │
│   "_id": "user123",          │
│   "name": "John",            │
│   "mobile": "9876543210",    │
│   "bio": "Hello!",           │
│   "profilepic": "..."        │
│ }                            │
└──────────────────────────────┘
    ↓
Frontend receives response
    ↓
Browser automatically stores JWT cookie
    ↓
Frontend updates state
    ↓
User is logged in!
```

---

## Key Points to Remember

### 🔐 Security
- JWT stored in HTTP-only cookie (can't be accessed by JavaScript)
- Cookies sent automatically with `credentials: 'include'`
- CORS prevents cross-origin attacks
- protectRoute middleware validates every request

### 🔄 Data Flow
- All requests → use `credentials: 'include'` to send cookies
- All protected endpoints → require valid JWT in cookie
- Frontend → Backend via HTTP, Backend → Database via Mongoose

### 📡 CORS Headers
```
Frontend              Backend
localhost:5173  →  localhost:5001
    ↓                    ↓
Preflight OPTIONS request
    ↓                    ↓
Browser checks CORS headers
Access-Control-Allow-Origin: http://localhost:5173 ✓
    ↓                    ↓
Request allowed
```

### 🔌 Ready for Socket.io
Replace HTTP polling with WebSocket events:
- `socket.emit('sendMessage')` → Instead of POST request
- `socket.on('newMessage')` → Instead of polling GET request
- Real-time updates for all connected users

---

This completes the full authentication and messaging system integration! 🎉
