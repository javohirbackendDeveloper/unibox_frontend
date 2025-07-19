import React, { useEffect, useState } from "react";
import LeftsideHeader from "./leftsideHeader/LeftsideHeader";
import { Search, Image, Video, CheckCheck } from "lucide-react";
import dayjs from "dayjs";
import "./Leftside.css";
import { FriendshipStore } from "../../../stores/friendshipStore";
import { AuthStore } from "../../../stores/auth.store";

function Leftside({ setSelectedChat, selectedChat }) {
  const [search, setSearch] = useState("");
  const { getMyFriends, chats } = FriendshipStore();
  const { user, fetchUserInfo, onlineUsers } = AuthStore();

  useEffect(() => {
    fetchUserInfo();
  }, []);
  const filteredConversations = chats.filter((item) => {
    return search === ""
      ? item
      : item?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          item?.user?.name?.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    getMyFriends();
  }, []);

  console.log({ onlineUsers });

  return (
    <div className="leftside-container">
      <LeftsideHeader />

      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Chatlarni qidiring"
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredConversations.length > 0 ? (
        <div className="chat-list">
          {filteredConversations.map((chat, idx) => (
            <div
              className="chat-item"
              key={idx}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="avatar-wrapper">
                <img
                  src={chat?.user?.image || "./avatar.png"}
                  alt="avatar"
                  className="avatar"
                />
                {onlineUsers.includes(chat?.user?.id) && (
                  <span className="online-indicator"></span>
                )}
              </div>

              <div className="chat-content">
                <div className="chat-header">
                  <p className="chat-name">
                    {chat?.user?.name ||
                      chat?.user?.email.split("@")[0] ||
                      "Private chat"}
                  </p>
                  <div className="chat-meta">
                    {chat?.friendship?.senderId === user?.id && (
                      <CheckCheck className="check-icon" size={14} />
                    )}
                    <span className="chat-time">
                      {dayjs(chat?.friendship?.createdAt).format("HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="chat-message">
                  {chat?.friendship?.lastMessage.length <= 30
                    ? chat?.friendship?.lastMessage
                    : chat?.friendship?.lastMessage.slice(0, 30) + "..."}
                </div>

                <div className="chat-message">
                  {chat?.lastMessage?.messageType === "text" &&
                    chat?.lastMessage?.content.slice(0, 30) + "..."}
                  {chat?.lastMessage?.messageType === "image" && (
                    <Image size={14} />
                  )}
                  {chat?.lastMessage?.messageType === "video" && (
                    <Video size={14} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-chat">Hozircha chatlar mavjud emas</div>
      )}
    </div>
  );
}

export default Leftside;
