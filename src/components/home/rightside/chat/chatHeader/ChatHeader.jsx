import { users } from "../../../../../dummyData/user";
import { Button, Dialog } from "@mui/material";
import { Crown, Phone, Video, X } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./ChatHeader.css";
import { AuthStore } from "../../../../../stores/auth.store";

function ChatHeader({ selectedChat }) {
  const isGroup = true;
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
            <span className="online-text">onlayn</span>
          ) : (
            <span className="ofline-text">oflayn</span>
          )}
        </div>
      </Button>

      <div className="header-icons">
        <Phone />
        <Link to={"/video-call"}>
          <Video />
        </Link>
        <X onClick={() => selectedChat(false)} />
      </div>

      <Dialog
        open={open}
        onClose={() => onClose(false)}
        PaperProps={{
          sx: {
            padding: 3,
            minWidth: 320,
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "12px",
            backgroundColor: "#fff",
          },
        }}
      >
        <div className="dialog-content">
          <div className="dialog-header">
            <span>Guruh a'zolari</span>
            <Button onClick={() => onClose(false)} className="close-btn">
              <X />
            </Button>
          </div>

          {/* Foydalanuvchilar ro'yhati */}
          {users.map((user, idx) => (
            <div className="user-row" key={idx}>
              <div className="avatar-wrapper">
                <img src={user?.image ? user.image : "./avatar.png"} alt="" />
                {user?.isOnline && <span className="online"></span>}
              </div>
              <span className="user-name">
                {user?.name ? user.name : user?.email?.split("@")[0]}
              </span>
              {user?.admin && <Crown size={16} className="crown-icon" />}
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
}

export default ChatHeader;
