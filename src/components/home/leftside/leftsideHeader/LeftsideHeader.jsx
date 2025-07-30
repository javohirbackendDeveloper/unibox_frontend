import React, { useEffect, useState } from "react";
import { Bell, File, LogOut, Search, User } from "lucide-react";
import "./LeftHeader.css";
import { AuthStore } from "../../../../stores/auth.store";
import SearchModal from "../../../../pages/searchModal/SearchModal";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../../../../pages/profile/Profile";
import { Dialog } from "@mui/material";
import Notification from "../../../../pages/notification/Notification";
import { FriendshipStore } from "../../../../stores/friendshipStore";

function LeftsideHeader() {
  const { user, logout, fetchUserInfo } = AuthStore();
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const { getUnreadInvites, unReadInvites, updateRead } = FriendshipStore();
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };

  const handleOpenNotification = () => {
    updateRead();

    setOpenNotificationModal(!openNotificationModal);
  };
  useEffect(() => {
    getUnreadInvites();
  }, []);

  return (
    <div className="left-header">
      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      >
        <Profile onClose={() => setOpenProfileModal(false)} />
      </Dialog>

      <button className="icon-button user-button" aria-label="User Profile">
        {user ? (
          <img
            onClick={() => setOpenProfileModal(true)}
            className="user_profile_img"
            src={user?.image ? user.image : "./avatar.png"}
            alt="Profile"
          />
        ) : (
          <User />
        )}
      </button>

      <button
        onClick={() => setOpenSearchModal(true)}
        className="icon-button logout-button"
      >
        <Search />
      </button>
      <button
        className="icon-button logout-button notification-btn"
        onClick={handleOpenNotification}
      >
        <Bell />
        {unReadInvites?.length > 0 && (
          <span className="notification-badge">{unReadInvites.length}</span>
        )}
      </button>
      <button
        className="icon-button logout-button"
        onClick={() => {
          if (window.innerWidth > 768) {
            window.open("/editingZone", "_blank", "noopener,noreferrer");
          } else {
            window.location.href = "/editingZone";
          }
        }}
      >
        <File />
      </button>

      <button
        onClick={handleLogout}
        className="icon-button logout-button"
        aria-label="Log Out"
      >
        <LogOut />
      </button>

      {openSearchModal && (
        <SearchModal onClose={setOpenSearchModal} open={openSearchModal} />
      )}
      {openNotificationModal && (
        <Notification
          onClose={setOpenNotificationModal}
          open={openNotificationModal}
        />
      )}
    </div>
  );
}

export default LeftsideHeader;
