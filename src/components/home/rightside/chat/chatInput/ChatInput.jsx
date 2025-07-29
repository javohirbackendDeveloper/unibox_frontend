import { Smile, Mic, Paperclip, Send } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import { ChatStore } from "../../../../../stores/chat.store";
import Emoji, { Theme } from "emoji-picker-react";
import AudioHandler from "./audiHandler/AudioHandler";

function ChatInput({ selectedChat }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { sendMessage } = ChatStore();
  const [openEmojiModal, setEmojiModal] = useState(false);
  const [showAudioHandler, setShowAudioHandler] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setEmojiModal(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (!message.trim() && !file) return;

    const formData = new FormData();
    if (message.trim()) formData.append("text", message.trim());
    if (selectedChat?.friendship?.id)
      formData.append("friendship", selectedChat?.friendship?.id);
    if (file) formData.append("file", file);

    sendMessage(formData, selectedChat?.friendship.id);

    setMessage("");
    setFile(null);
    document.getElementById("chat-file-input").value = "";
  };

  return (
    <div className="chat-input-container" style={{ position: "relative" }}>
      {showAudioHandler ? (
        <AudioHandler
          close={setShowAudioHandler}
          friendshipId={selectedChat?.friendship.id}
        />
      ) : (
        <>
          <button
            className="btn"
            onClick={() => setEmojiModal(!openEmojiModal)}
            ref={emojiButtonRef}
          >
            <Smile className="icon" />
          </button>

          {openEmojiModal && (
            <div
              ref={emojiPickerRef}
              style={{
                position: "absolute",
                bottom: "3rem",
                left: "50px",
                zIndex: 50,
              }}
            >
              <Emoji
                theme={Theme.DARK}
                onEmojiClick={(emojiData) =>
                  setMessage((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}

          <label className="file-upload-label">
            <input
              id="chat-file-input"
              type="file"
              className="hidden-file-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <Paperclip className="icon" />
          </label>

          <input
            type="text"
            placeholder="Xabar yozing"
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button className="btn" onClick={() => setShowAudioHandler(true)}>
            <Mic className="icon mic-icon" />
          </button>
          <button className="btn" onClick={handleSend}>
            <Send className={message || file ? "active" : "icon"} />
          </button>
        </>
      )}
    </div>
  );
}

export default ChatInput;
