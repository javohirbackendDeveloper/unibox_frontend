import React, { useEffect, useRef } from "react";
import "./MainChat.css";
import { ChatStore } from "../../../../../stores/chat.store";
import { AuthStore } from "../../../../../stores/auth.store";
import dayjs from "dayjs";
import { Check, CheckCheck, VideoOff } from "lucide-react";
import { socket } from "../../../../../socket";

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

      socket.emit("mark_as_read", {
        friendshipId: selectedChat.friendship.id,
        readerId: user?.id,
      });
    }
  }, [selectedChat?.friendship?.id, user?.id]);

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
        messages.map((message) => (
          <div
            key={message.friendship?.id}
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
              {(message?.text && message.text.startsWith("http") && (
                <a href={message.text} rel="noopener noreferer" target="_blank">
                  {message.text}
                </a>
              )) || <p>{message?.text}</p>}

              {message?.voice && (
                <video controls src={message.voice} type="audio/mpeg"></video>
              )}

              {message?.image && (
                <img
                  src={message.image}
                  alt="uploaded"
                  className="message-image"
                />
              )}
              <span className="message-created-at">
                {dayjs(message?.createdAt).format("HH:mm")}
              </span>
              {message?.sender?.id === user?.id && (
                <span className="message-created-at">
                  {message?.isRead ? (
                    <CheckCheck className="checkcheck-icon" />
                  ) : (
                    <Check className="check-icon" />
                  )}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-chat-card">
          <p className="main-text">Hozircha xabarlar yo'q</p>
          <button className="wave-button" onClick={handleSendMessage}>
            Assalomu alaykum
          </button>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default MainChat;
