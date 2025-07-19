import React, { useEffect, useState } from "react";
import { LogOut, Search, User } from "lucide-react";
import "./leftHeader.css";
import { AuthStore } from "../../../../stores/auth.store";
import SearchModal from "../../../../pages/searchModal/SearchModal";
import { useNavigate } from "react-router-dom";

function LeftsideHeader() {
  const { user, logout, fetchUserInfo } = AuthStore();
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };
  return (
    <div className="left-header">
      <button className="icon-button user-button" aria-label="User Profile">
        {user ? (
          <img
            className="user_profile_img"
            src={user?.image ? user.image : "./avatar.png"}
          />
        ) : (
          <User />
        )}
      </button>
      <button className="icon-button logout-button">
        <Search onClick={() => setOpenSearchModal(true)} />
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
    </div>
  );
}

export default LeftsideHeader;
