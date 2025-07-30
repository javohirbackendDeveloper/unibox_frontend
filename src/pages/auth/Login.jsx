import React, { useEffect, useState } from "react";
import { account } from "../../appwriteConfig.js";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FcGoogle } from "react-icons/fc";
import { AuthStore } from "../../stores/auth.store.js";
import { socket } from "../../socket.js";

const Login = () => {
  const { login } = AuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    login({ email: form.email, password: form.password }, navigate);
  };

  const handleGoogleLogin = async () => {
    account.createOAuth2Session(
      "google",
      "https://unibox-frontend-spxn.vercel.app/oauth-callback",
      "https://unibox-frontend-spxn.vercel.app/fail"
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Kirish</h1>
        <input
          type="email"
          name="email"
          placeholder="✉ Email"
          className="auth-input"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="🔒 Parol"
          className="auth-input"
          value={form.password}
          onChange={handleChange}
        />

        <button className="auth-button" onClick={handleLogin}>
          Kirish
        </button>
        <button className="auth-button google" onClick={handleGoogleLogin}>
          <FcGoogle size={20} style={{ marginRight: "8px" }} /> Google orqali
          kirish
        </button>

        <p className="auth-link">
          Akkount yo‘qmi? <a href="/register">Ro‘yxatdan o‘tish</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
