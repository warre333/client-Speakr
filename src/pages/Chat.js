import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import Header from '../components/header'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import { isAuthenticated } from '../functions/Common'

import { API_URL } from '../config/api.config'


function Chat() {
  const params = useParams()
  const navigate = useNavigate()

  const chatroom = params.chatroom
  const socket = io(API_URL, { transports : ['websocket', 'polling', 'flashsocket'] });
  
  const [user, setUser] = useState()
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [popup, setPopup] = useState()
  
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {      
    async function auth(){
      await isAuthenticated()
        .then((response) => {
          if(response.success){
            const username = response.data.user_id

            setUser(username)
            socket.auth = { username }
            socket.connect()

          } else {
            setPopup("login");
          }        
        })       
    }

    auth()
  }, [])

  useEffect(() => {
    if(!chatroom || !(user && user !== "none")) return
    socket.emit('leave', { user_id: user }, (error) => {
      if(error) {
        console.log(error);
      }
    });

    socket.emit('join', { user_id: user, chatroom }, (error) => {
      if(error) {
        navigate('/messages')
      }
    });

    setJoinedRoom(true)
  }, [chatroom, user]) 

  useEffect(() => {
    socket.on('message', message => {
      setMessages(msgs => [ ...msgs, message ]);
    });
    
    socket.on("roomData", ({ users, messages }) => {
      setUsers(users);
      setMessages(messages)
    });

    // socket.on("users", (users) => {
    //   users.forEach((user) => {
    //     user.messages.forEach((message) => {
    //       message.fromSelf = message.from === socket.userID;
    //     });
    //     for (let i = 0; i < this.users.length; i++) {
    //       const existingUser = this.users[i];
    //       if (existingUser.userID === user.userID) {
    //         existingUser.connected = user.connected;
    //         existingUser.messages = user.messages;
    //         return;
    //       }
    //     }      
    //   })
    // })
  });

  const sendMessage = () => {
    if(message) {
      socket.emit('sendMessage', { user_id: user, chatroom, message }, () => setMessage(''));
      document.getElementById('messageInput').value = ""
    }
  }

  const pressEnter = (e) => {
    if(e.key === "Enter"){
      sendMessage()
    }
  }

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}


        {/* 
        
            Page content

        */}
        {joinedRoom && (
          <div className="fixed top-0 left-0 w-screen h-screen mt-24">
            <div className="container mx-auto overflow-auto h-3/4 md:w-1/2 w-full flex flex-col-reverse">
              <div class="w-full px-5 flex flex-col justify-between">
                <div class="flex flex-col mt-5">
                  {messages && messages.map((text, key) => {
                    if(text.user_id === user){
                      return(
                        <div class="flex justify-end mb-4" key={key}>
                          <div class="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-full text-ellipsis break-words">
                            {text.user}: {text.text}
                          </div>
                        </div>
                      )
                    } else {
                      return(
                        <div class="flex justify-start mb-4" key={key}>
                          <div class="py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-full text-ellipsis break-words">
                            {text.user}: {text.text}
                          </div>
                        </div>
                      )
                    }
                  })}

                </div> 
              </div> 
            </div> 
            <div className="flex flex-row container mx-auto md:w-1/2 w-full">
              <input type="text" className="border w-full rounded-full pl-6" onChange={(e) => { setMessage(e.target.value) }} onKeyDown={pressEnter} name="" id="messageInput" />
              <button className="bg-blue-400 py-3 px-8 ml-4 rounded-full text-white" onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}

        {!joinedRoom && (
          Loading
        )}

        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
    </div>
  )
}

export default Chat