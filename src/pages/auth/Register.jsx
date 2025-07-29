import React, { useEffect, useState } from "react";
import { account, ID } from "../../appwriteConfig.js";
import "./auth.css";
import { FcGoogle } from "react-icons/fc";
import { AuthStore } from "../../stores/auth.store.js";
import { toast } from "sonner";

const Register = () => {
  const { signup } = AuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await signup({
        email: form.email,
        password: form.password,
        registerType: "local",
      });

      if (res.success) {
        toast.success("Siz muvaffaqiyatli ro'yxatdan o'tdingiz");
        window.location.href = "/login";
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    account.createOAuth2Session(
      "google",
      "http://localhost:5173/login",
      "http://localhost:5173/fail"
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const userData = await account.get();
        signup({ email: userData.email, registerType: "google" });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Ro‘yxatdan o‘tish</h1>

        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="✉ Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="🔒 Parol"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="auth-button" onClick={handleRegister}>
          Ro‘yxatdan o‘tish
        </button>

        <button className="auth-button google" onClick={handleGoogleLogin}>
          <FcGoogle size={20} style={{ marginRight: "8px" }} /> Google orqali
          ro‘yxatdan o‘tish
        </button>

        <p className="auth-link">
          Allaqachon akkountingiz bormi? <a href="/login">Kirish</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
