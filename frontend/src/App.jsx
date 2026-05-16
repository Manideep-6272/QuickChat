import React from "react";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import {Routes,Route} from 'react-router-dom';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
      </Routes>
    </div>
  );
}

export default App;
