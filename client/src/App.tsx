import React, { useEffect, useState, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

const App: React.VFC = () => {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [message, setMessage] = useState("")
  const socket = useRef<Socket>();

  const handleSubmitNewMessage = () => {
    socket.current?.emit('message', { data: message });
    setMessage("")
  }

  useEffect(() => {
    socket.current = io("http://localhost:3000")
    socket.current.on('message', ({data}) => {
      console.log("React側に来ました", data)
      setMessageList((prevMessageList) => {
        console.log(prevMessageList)
        return [...prevMessageList, data]
      });
    })
    return () => {
      socket.current?.disconnect();
    }
  // eslint-disable-next-line
  }, [])

  return (
    <>
      <div>
        <ul id="messages">{messageList.map((m, index) => <li key={index}>{m}</li>)}</ul>
      </div>
      <div>
        <input id="message" type="text" value={message} onChange={e => setMessage(e.target.value)}/>
        <button onClick={handleSubmitNewMessage}>Submit</button>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.0/socket.io.js"></script>
      <script src="./chat-socket.js"></script>
    </>
  );
}

export default App;
