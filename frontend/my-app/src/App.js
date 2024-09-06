import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import sendBtn from './assets/send.png';
import userIcon from './assets/user.jpg';
import llmIcon from './assets/headset1.png';

function App() {
  const messageEnd = useRef(null)
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('Hey there! Welcome to VARlab. How can I assist you today?'); 

  useEffect(()=>{
    messageEnd.current.scrollIntoView();
  }, [responses])

  const sendMessage = async () => {
    if (input.trim() === '') return;

    if (welcomeMessage) {
      setWelcomeMessage(null); 
    }
    
    setResponses([...responses, { type: 'user', text: input }]);

    try {
      const response = await fetch('http://localhost:5000/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      setResponses((prevResponses) => [...prevResponses, { type: 'llm', text: data.response }]);
    } catch (error) {
      console.error('Error interacting with backend:', error);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(); 
    }
  };

  return (
    <div className="App">
      <div className="responses">
        {welcomeMessage && (
          <div className="welcomeMessage">
            <p>{welcomeMessage}</p>
          </div>
        )}

        {responses.map((res, index) => (
          <div key={index} className={`response ${res.type === 'llm' ? 'llm' : ''}`}>
            <img className="uimages" src={res.type === 'llm' ? llmIcon : userIcon} alt="" />
            <p className="promptText">{res.text}</p>
          </div>
        ))}

        <div ref={messageEnd}/>
      </div>
      <div className="promptMessage">
        <div className="userprompt">
          <input
            type="text"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send user input"
          />
          <button className="send" onClick={sendMessage}>
            <img src={sendBtn} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;


//References:
//https://www.youtube.com/watch?v=EzkWAviyYgg
//