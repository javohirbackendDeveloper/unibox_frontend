import React, { useEffect, useRef } from "react";
import "./MainChat.css";
import { ChatStore } from "../../../../../stores/chat.store";
import { AuthStore } from "../../../../../stores/auth.store";

function MainChat({ selectedChat }) {
  const { user, fetchUserInfo } = AuthStore();
  const {
    getMessages,
    messages,
    sendMessage,
    clearMessages,
    listenToMessages,
  } = ChatStore();
  const chatEndRef = useRef(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (selectedChat?.friendship?.id) {
      clearMessages();
      getMessages(selectedChat.friendship.id);
      listenToMessages(selectedChat.friendship.id);
    }
  }, [selectedChat?.friendship?.id]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const formData = new FormData();

    formData.append("text", "Assalomu alaykum");
    formData.append("friendship", selectedChat?.friendship?.id);
    sendMessage(formData, selectedChat?.friendship?.id);
  };

  return (
    <div className="main-chat">
      {messages?.length > 0 ? (
        messages?.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${
              message?.sender?.id === user?.id
                ? "user-message"
                : "friend-message"
            }`}
          >
            <img
              src={message?.sender?.image || "./avatar.png"}
              alt="avatar"
              className="avatar"
            />
            <div className="message-content">
              {message?.text && <p>{message?.text}</p>}
              {message?.image && (
                <img
                  src={message?.image}
                  alt="uploaded"
                  className="message-image"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-chat-card">
          <p className="main-text">Hozircha xabarlar yo'q</p>
          <p className="sub-text">
            Xabar yuboring yoki quyidagi salomlashuvni yuboring
          </p>
          <button className="wave-button" onClick={handleSendMessage}>
            <span role="img" aria-label="wave" style={{ fontSize: "18px" }}>
              Assalomu alaykum
            </span>
          </button>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default MainChat;
