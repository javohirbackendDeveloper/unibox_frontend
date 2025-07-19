import { Dialog } from "@mui/material";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AuthStore } from "../../stores/auth.store";
import "./SearchModal.css";
import { Link } from "react-router-dom";
import { FriendshipStore } from "../../stores/friendshipStore";

function SearchModal({ open, onClose }) {
  const { getAllUsers, users } = AuthStore();
  const { createFriendship } = FriendshipStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = users.filter((item) => {
    return search === ""
      ? item
      : item?.email?.toLowerCase().includes(search?.toLowerCase()) ||
          item?.name?.toLowerCase().includes(search?.toLowerCase());
  });

  const handleSendInvite = (user2Id) => {
    createFriendship({ user2: user2Id });
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="modal-container">
        <X className="close-icon" size={20} onClick={() => onClose(false)} />

        <h2 className="modal-title">Do'stlarni qidirish</h2>

        <input
          type="text"
          className="search-input"
          placeholder="✉️ Email yoki ism orqali qidiring..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredUsers.length > 0 ? (
          <div className="user-list">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <img
                  src={user?.image || "./avatar.png"}
                  alt="User"
                  className="user-avatar"
                />
                <span className="user-name">
                  {user?.name || user?.email.split("@")[0]}
                </span>
                <button
                  className="invite-button"
                  onClick={() => handleSendInvite(user.id)}
                >
                  Chatga taklif yuborish
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img src="./noData.png" alt="No Data" className="empty-image" />
            <span className="empty-text">Bunday foydalanuvchi topilmadi</span>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default SearchModal;
