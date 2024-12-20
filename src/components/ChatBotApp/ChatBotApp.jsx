import React, { useEffect, useRef, useState } from "react";
import "./ChatBotApp.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatBotApp = ({
  onGoBack,
  chats,
  setChats,
  activeChat,
  setActiveChat,
  onNewChat,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(chats[0]?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const chatEndRef = useRef();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const activeChatWithID = chats.find((chat) => chat.id === activeChat);

    setMessages(activeChatWithID ? activeChatWithID.messages : []);
  }, [activeChat, chats]);

  const handleEmojiSelect = (emoji) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      type: "prompt",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Its handle when user type and entering input prompt. Its going to be create the new chat
    if (!activeChat) {
      onNewChat(inputValue);
      setInputValue("");
    } else {
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputValue("");

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });

      setChats(updatedChats);
      setIsTyping(true);

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_API_OPENAI_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: inputValue }],
              max_tokens: 500,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error?.code === "insufficient_quota") {
            throw new Error("Sorry! You have reached the API limit.");
          } else {
            throw new Error(
              "An error occurred while communicating with the API."
            );
          }
        }

        const data = await response.json();
        const chatResponse = data.choices[0].message.content.trim();

        const newResponse = {
          type: "response",
          text: chatResponse,
          timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessagesWithResponse = [...updatedMessages, newResponse];
        setMessages(updatedMessagesWithResponse);

        const updatedChatsWithResponse = chats.map((chat) => {
          if (chat.id === activeChat) {
            return { ...chat, messages: updatedMessagesWithResponse };
          }
          return chat;
        });

        setChats(updatedChatsWithResponse);
      } catch (error) {
        const errorResponse = {
          type: "response",
          text: error.message,
          timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessagesWithError = [...updatedMessages, errorResponse];
        setMessages(updatedMessagesWithError);
        setIsTyping(false);

        const updatedChatsWithError = chats.map((chat) => {
          if (chat.id === activeChat) {
            return { ...chat, messages: updatedMessagesWithError };
          }
          return chat;
        });

        setChats(updatedChatsWithError);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectChat = (id) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter((chat) => chat.id !== id);

    setChats(updatedChats);

    if (id === activeChat) {
      // This profession will be active when the chat item curently is delete, is move next the first item in the Chat list
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;

      setActiveChat(newActiveChat);
    }
  };

  return (
    <div className="chat-app">
      <div className={`chat-list ${showChatList ? "show" : ""} `}>
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i
            className="bx bx-edit-alt new-chat"
            onClick={() => onNewChat()}
          ></i>
          <i className="bx bx-x-circle" onClick={() => setShowChatList(false)}></i>
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${
              chat.id === activeChat ? "active" : ""
            }`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <h4>{chat.displayId}</h4>
            <i
              className="bx bx-x-circle"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.id);
              }}
            ></i>
          </div>
        ))}
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-menu" onClick={() => setShowChatList(true)}></i>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.type === "prompt" ? "prompt" : "response"}
            >
              {msg.text} <span>{msg.timestamp} </span>
            </div>
          ))}
          {isTyping && <div className="typing">Typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <i
            className="fa-solid fa-face-smile emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          ></i>
          {showEmojiPicker && (
            <div className="picker">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <input
            placeholder="Type a message..."
            type="text"
            className="msg-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)}
          />
          <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
