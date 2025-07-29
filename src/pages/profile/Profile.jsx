import React, { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Dialog,
  IconButton,
} from "@mui/material";
import "./Profile.css";
import { AuthStore } from "../../stores/auth.store";
import { toast } from "sonner";
import { FriendshipStore } from "../../stores/friendshipStore";

function Profile({ onClose }) {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeat: false,
  });
  const { getMyContacts, contacts } = FriendshipStore();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    repeat: "",
  });

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.repeat) {
      toast.error("Yangi parol va takrorlangan parol bir xil emas!");
      return;
    }
    try {
      setOpenPasswordModal(false);
      setPasswords({ current: "", new: "", repeat: "" });
      updateProfile({
        oldPassword: passwords.current,
        password: passwords.new,
      });
    } catch (error) {
      toast.error("Parolni o‘zgartirishda xatolik yuz berdi");
    }
  };

  const {
    user,
    fetchUserInfo,
    updateProfile,
    updateProfileImage,
    deleteProfileImage,
  } = AuthStore();

  const [openNameInput, setOpenNameInput] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchUserInfo();
    if (user?.name) setName(user.name);
  }, [fetchUserInfo, user?.name]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    try {
      await updateProfile({ name });
      setOpenNameInput(false);
      fetchUserInfo();
    } catch (error) {
      console.error("Ismni yangilashda xatolik:", error);
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        await updateProfileImage(formData);
        await fetchUserInfo();
      } catch (error) {
        console.error("Rasmni yuklashda xatolik:", error);
      }
    }
  };

  useEffect(() => {
    getMyContacts();
  }, []);
  return (
    <div className="profile-container">
      <IconButton className="close-button" onClick={onClose}>
        <X />
      </IconButton>

      <DialogTitle className="profile-title">Profil</DialogTitle>

      <DialogContent className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={user?.image ? user.image : "./avatar.png"}
              alt="Profile"
              className="profile-avatar"
              onClick={() => setOpenImageModal(true)}
              style={{ cursor: "pointer" }}
            />
            <div className="profile-stats">
              <div>
                <p className="stat-number">{contacts?.myAllContacts?.length}</p>
                <p className="stat-label">Kontaktlar</p>
              </div>
              <div>
                <p className="stat-number">{contacts?.sentInvites?.length}</p>
                <p className="stat-label">Taklif yuborilgan chatlar</p>
              </div>
              <div>
                <p className="stat-number">
                  {contacts?.acceptedInvites?.length}
                </p>
                <p className="stat-label">Qabul qilingan chatlar</p>
              </div>
            </div>
          </div>

          <div className="profile-info">
            {user?.name && <h2>{user?.name}</h2>}
            <p>{user?.email}</p>
          </div>

          <div className="profile-actions">
            {openNameInput ? (
              <>
                <TextField
                  label="Yangi ism"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="name-input"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateName}
                  className="action-btn"
                >
                  Saqlash
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => {
                    setOpenNameInput(false);
                    setName(user?.name || "");
                  }}
                  className="action-btn cancel-btn"
                >
                  Bekor qilish
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => setOpenNameInput(true)}
                  className="action-btn"
                >
                  Ism qo'shish
                </Button>
                {user?.image && (
                  <Button
                    variant="outlined"
                    color="error"
                    className="action-btn"
                    onClick={deleteProfileImage}
                  >
                    Suratni o‘chirish
                  </Button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    className="action-btn"
                    component="span"
                  >
                    Yangi surat yuklash
                  </Button>
                </label>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenPasswordModal(true)}
                  className="action-btn"
                >
                  Parolni o‘zgartirish
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>

      <Dialog
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      >
        <DialogTitle>Parolni o‘zgartirish</DialogTitle>
        <DialogContent className="password-modal">
          {["current", "new", "repeat"].map((field, idx) => (
            <div key={idx} className="password-field">
              <TextField
                fullWidth
                value={passwords[field]}
                onChange={(e) => handlePasswordChange(field, e.target.value)}
                label={
                  field === "current"
                    ? "Hozirgi parol"
                    : field === "new"
                    ? "Yangi parol"
                    : "Yangi parolni qayta kiriting"
                }
                type={showPassword[field] ? "text" : "password"}
              />
              <div className="eye-icon" onClick={() => togglePassword(field)}>
                {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePassword}
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        className="image-modal"
      >
        <img
          src={user?.image ? user.image : "./avatar.png"}
          alt="Profile Large"
          className="modal-avatar"
        />
      </Dialog>
    </div>
  );
}

export default Profile;
