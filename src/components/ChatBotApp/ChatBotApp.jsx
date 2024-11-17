import React, { useState } from "react";
import "./ChatBotApp.css";

const ChatBotApp = ({ onGoBack, chats, setChats }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(chats[0]?.messages || []);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = () => {
    if (inputValue.trim === "") return;

    const newMessage = {
      type: "prompt",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInputValue("");

    const updateChats = chats.map((chat, index) => {
      if (index === 0) {
        return { ...chats, messages: updatedMessages };
      }
      return chat;
    });

    setChats[updateChats];
  };
  return (
    <div className="chat-app">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat"></i>
        </div>
        {chats.map((chat, index) => {
          <div
            key={index}
            className={`chat-list-item ${index === 0 ? "active" : ""}`}
          >
            <h4>{chat.id}</h4>
            <i className="bx bx-x-circle"></i>
          </div>;
        })}
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          <div className="prompt">
            Hi, how are you? <span>12:59:51 PM </span>
          </div>
          <div className="response">
            Hello! I'm just a computer program, so I don't have feelings, but
            I'm here and ready to assist you? How can I help you today?
            <span>12:59:52 PM </span>
          </div>
          <div className="typing">Typing...</div>
        </div>
        <form className="msg-form">
          <i className="fa-solid fa-face-smile emoji"></i>
          <input
            placeholder="Type a message..."
            type="text"
            className="msg-input"
          />
          <i className="fa-solid fa-paper-plane"></i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
