import React from "react";
import "./ChatBotApp.css";

const ChatBotApp = () => {
  return (
    <div className="chat-app">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat"></i>
        </div>
        <div className="chat-list-item">
          <h4>Chat 20/07/2024 12:59:42 PM</h4>
          <i className="bx bx-x circle"></i>
        </div>
        <div className="chat-list-item">
          <h4>Chat 20/07/2024 12:59:42 PM</h4>
          <i className="bx bx-x circle"></i>
        </div>
        <div className="chat-list-item">
          <h4>Chat 20/07/2024 12:59:42 PM</h4>
          <i className="bx bx-x circle"></i>
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-arrow-back arrow"></i>
        </div>
        <div className="chat">
          <div className="prompt">
            Hi, how are you? <span>12:59:51 PM </span>
          </div>
          <div className="prompt">
            Hello! I'm just a computer program, so I don't have feelings, but
            I'm here and ready to assist you? How can I help you today?
            <span>12:59:52 PM </span>
          </div>
          <div className="typing">Typing...</div>
        </div>
        <form className="msg-form">
          <i className="fa-solid fa-face smile emoji">
            <input
              placeholder="Type a message..."
              type="text"
              className="msg-input"
            />
            <i className="fa-solid fa-paper-plane"></i>
          </i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
