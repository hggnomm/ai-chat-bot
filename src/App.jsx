import React, { useState } from "react";
import ChatBotStart from "./components/ChatBotStart/ChatBotStart";
import ChatBotApp from "./components/ChatBotApp/ChatBotApp";

const App = () => {
  const [isChatting, setIsChatting] = useState(false);

  const handleStartChat = () => {
    setIsChatting(true);
  };

  const handleGoBack = () => {
    setIsChatting(false);
  };
  return (
    <div className="container">
      {!isChatting ? (
        <ChatBotStart onStartChat={handleStartChat} />
      ) : (
        <ChatBotApp onGoBack={handleGoBack} />
      )}
    </div>
  );
};

export default App;
