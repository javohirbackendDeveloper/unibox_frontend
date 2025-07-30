import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "sonner";
import { AuthStore } from "./stores/auth.store";
import { account } from "./appwriteConfig";
import OAuthCallback from "./pages/auth/OauthCallback";
import { socket } from "./socket";
import VideoCall from "./pages/video-call/VideoCall";
import Profile from "./pages/profile/Profile";
import Leftside from "./components/home/leftside/Leftside";
import EditingZone from "./pages/textEditor/editingZone/EditingZone";
import { v4 as uuidV4 } from "uuid";

function App() {
  const { fetchUserInfo, user, setUser, setOfflineUser, setOnlineUser } =
    AuthStore();

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          await fetchUserInfo();
        } else {
          const userData = await account.get();

          // setUser(userData);
        }
      } catch (err) {
        setUser(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (user?.id) {
      socket.io.opts.query = { userId: user.id };
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    socket.on("user_online", (userId) => {
      setOnlineUser(userId);
    });

    socket.on("user_offline", (userId) => {
      setOfflineUser(userId);
    });
  }, []);

  console.log({ user });

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route
          path="/editingZone"
          element={<Navigate to={`/editingZone/${uuidV4()}`} replace />}
        />
        <Route path="/editingZone/:id" element={<EditingZone />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </div>
  );
}

export default App;
