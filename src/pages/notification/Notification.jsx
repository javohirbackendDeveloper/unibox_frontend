import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { FriendshipStore } from "../../stores/friendshipStore";
import { AuthStore } from "../../stores/auth.store";
import "./Notification.css";

function NotificationModal({ open, onClose }) {
  const { getMyContacts, contacts, acceptInvite, cancelInvite } =
    FriendshipStore();
  const [activeTab, setActiveTab] = useState("accepted");
  const { user, fetchUserInfo } = AuthStore();

  useEffect(() => {
    if (open) {
      getMyContacts();
    }
  }, [open]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const invites =
    activeTab === "accepted"
      ? contacts?.acceptedInvites
      : contacts?.sentInvites;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="dialogtitle">
        <span className="dialogtitle-text">Bildirishnomalar</span>
        <IconButton onClick={() => onClose(false)} className="x-icon">
          <X />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="notification-tabs">
          <button
            className={activeTab === "accepted" ? "active" : "inactive"}
            onClick={() => setActiveTab("accepted")}
          >
            Kelgan takliflar
          </button>
          <button
            className={activeTab === "sent" ? "active" : "inactive"}
            onClick={() => setActiveTab("sent")}
          >
            Yuborilgan takliflar
          </button>
        </div>

        <div className="invite-list">
          {invites?.length ? (
            invites.map((invite, index) => {
              const friend =
                invite?.user1?.id === user?.id ? invite?.user2 : invite?.user1;

              return (
                <div key={index} className="invite-item">
                  <div className="invite-info">
                    <img src={friend?.image || "./avatar.png"} alt="User" />
                    <span>{friend?.name || friend?.email}</span>
                  </div>
                  <div className="invite-actions">
                    {activeTab === "accepted" && (
                      <button
                        className="accept_btn"
                        onClick={() => acceptInvite(invite?.id)}
                      >
                        Qabul qilish
                      </button>
                    )}
                    <button onClick={() => cancelInvite(invite?.id)}>
                      Bekor qilish
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">Hech narsa topilmadi</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationModal;
