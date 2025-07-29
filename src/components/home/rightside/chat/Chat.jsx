import React from "react";
import ChatHeader from "./chatHeader/ChatHeader";
import MainChat from "./mainChat/MainChat";
import ChatInput from "./chatInput/ChatInput";
import "./Chat.css";

function Chat({ setSelectedChat, selectedChat }) {
  return (
    <div className="chat-container">
      <div className="chat-header-section">
        <ChatHeader
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>

      <div className="chat-main-section">
        <MainChat selectedChat={selectedChat} />
      </div>

      <div className="chat-input-section">
        <ChatInput selectedChat={selectedChat} />
      </div>
    </div>
  );
}

export default Chat;
