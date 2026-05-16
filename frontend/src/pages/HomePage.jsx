import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import 'bootstrap/dist/css/bootstrap.min.css'
function HomePage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
        <div className='col-4 p-0'>
          <SideBar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        </div>
        <div className='col-8 p-0'>
          <ChatContainer selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  )
}
export default HomePage;