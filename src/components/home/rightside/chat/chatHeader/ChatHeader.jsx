import { Button, Dialog } from "@mui/material";
import { Trash, Video, X } from "lucide-react";
import { FcLeft } from "react-icons/fc";
import React, { useState } from "react";
import "./ChatHeader.css";
import { AuthStore } from "../../../../../stores/auth.store";
import { FriendshipStore } from "../../../../../stores/friendshipStore";
import { ChatStore } from "../../../../../stores/chat.store";
import { useNavigate } from "react-router-dom";

function ChatHeader({ selectedChat, setSelectedChat }) {
  const { cancelInvite } = FriendshipStore();
  const [open, setOpen] = useState(false);
  const { onlineUsers } = AuthStore();
  const { sendMessage } = ChatStore();
  const isDesktop = () => window.innerWidth >= 768;
  const navigate = useNavigate();
  const handleVideoCallClick = () => {
    const roomID = Math.random().toString(36).substring(2, 8);
    const videoCallLink = `${window.location.origin}/video-call?roomID=${roomID}`;

    const friendshipId = selectedChat?.friendship?.id;
    sendMessage(
      { text: `${videoCallLink}`, friendship: selectedChat?.friendship },
      friendshipId
    );

    if (isDesktop()) {
      window.open(videoCallLink, "_blank", "noopener,noreferrer");
    } else {
      setOpen(true);
      navigate(`/video-call?roomID=${roomID}`);
    }
  };

  return (
    <div className="chat-header">
      <button className="left_icon" onClick={() => setSelectedChat(null)}>
        <FcLeft size={24} />
      </button>

      <Button onClick={() => setOpen(true)} className="main-header-btn">
        <img
          src={selectedChat?.user?.image || "./avatar.png"}
          alt="User avatar"
        />
        <div className="header-text">
          <span>
            {selectedChat?.user?.name ||
              selectedChat?.user?.email.split("@")[0]}
          </span>
          {selectedChat?.isGroup ? (
            <span>A'zolarni ko‘rish</span>
          ) : onlineUsers.includes(selectedChat?.user?.id) ? (
            <span className="online-text">onlayn</span>
          ) : (
            <span className="ofline-text">oflayn</span>
          )}
        </div>
      </Button>

      <div className="header-icons">
        <button
          onClick={() => {
            cancelInvite(selectedChat?.friendship?.id);
            setSelectedChat(null);
          }}
          className="icon-btn"
          aria-label="Cancel Invite"
        >
          <Trash size={20} color="red" />
        </button>

        <button
          onClick={handleVideoCallClick}
          className="icon-btn"
          aria-label="Start Video Call"
        >
          <Video />
        </button>

        <button
          onClick={() => setSelectedChat(null)}
          className="icon-btn"
          aria-label="Close Chat"
        >
          <X />
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        className="video-call-modal"
      >
        <iframe
          title="Video Call"
          src="/video-call"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      </Dialog>
    </div>
  );
}

export default ChatHeader;
