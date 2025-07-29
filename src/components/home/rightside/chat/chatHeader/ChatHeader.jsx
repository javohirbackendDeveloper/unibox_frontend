import { users } from "../../../../../dummyData/user";
import { Button, Dialog } from "@mui/material";
import { Crown, Phone, Trash, Video, X } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./ChatHeader.css";
import { AuthStore } from "../../../../../stores/auth.store";
import { FriendshipStore } from "../../../../../stores/friendshipStore";

function ChatHeader({ selectedChat, setSelectedChat }) {
  const { cancelInvite } = FriendshipStore();
  const [open, onClose] = useState(false);
  const { onlineUsers } = AuthStore();

  return (
    <div className="chat-header">
      <Button onClick={() => onClose(true)} className="main-header-btn">
        <img src="./avatar.png" alt="User avatar" />
        <div className="header-text">
          <span>
            {selectedChat?.user?.name ||
              selectedChat?.user?.email.split("@")[0]}
          </span>
          {selectedChat?.isGroup ? (
            <span>A'zolarni ko'rish</span>
          ) : onlineUsers.includes(selectedChat?.user?.id) ? (
            <span
              className="online-text"
              style={{ color: "green", fontWeight: 700 }}
            >
              onlayn
            </span>
          ) : (
            <span className="ofline-text">oflayn</span>
          )}
        </div>
      </Button>

      <div className="header-icons">
        <button
          onClick={() => {
            cancelInvite(selectedChat?.friendship?.id) &&
              setSelectedChat(false);
          }}
          className="icon-btn"
        >
          <Trash size={20} color="red" />
        </button>
        <a href="video-call" target="_blank" rel="noopener noreferrer">
          <Video />
        </a>

        <X onClick={() => setSelectedChat(false)} />
      </div>

      <Dialog
        open={open}
        onClose={() => onClose(false)}
        className="image-modal"
      >
        <img
          src={selectedChat?.user?.imager || "./avatar.png"}
          alt=""
          className="modal-avatar"
        />
      </Dialog>
    </div>
  );
}

export default ChatHeader;
