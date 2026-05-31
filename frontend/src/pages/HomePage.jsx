import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import 'bootstrap/dist/css/bootstrap.min.css'
function HomePage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className='container-fluid h-100'>
      <div className='row h-100'>
        <div className='col-4 p-0' style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}>
          <SideBar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        </div>
        <div className='col-8 p-0' style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}>
          <ChatContainer selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  )
}
export default HomePage;