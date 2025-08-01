import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance, axiosMultipartHeader } from "./axios/axiosInstance";
import { account } from "../appwriteConfig";
import { socket } from "../socket";
export const AuthStore = create((set, get) => ({
  user: null,
  accessToken: window.localStorage.getItem("accessToken"),
  users: [],
  profileUser: null,
  onlineUsers: JSON.parse(window.localStorage.getItem("online_users")) || [],

  async login(data, navigate) {
    try {
      const res = await axiosInstance.post("/api/auth/login", data);

      console.log({ res });

      if (res.data?.accessToken) {
        window.localStorage.setItem("accessToken", res.data?.accessToken);
        socket.connect();
        // location.reload();
        toast.success(res.data?.message);
        navigate("/");
        return true;
      } else {
        toast.error(
          res.data?.message ||
            "Nimadir xato ketdi, iltimos malumotlarni tekshiring"
        );
        return false;
      }
    } catch (err) {
      return false;
      console.log("Login errror", err);
    }
  },

  async signup(data) {
    try {
      const res = await axiosInstance.post("/api/auth/register", data);

      if (res.data?.id) {
        // await get().fetchUserInfo();

        return { success: true, message: res.data?.message };
      } else {
        return { success: false, message: res.data?.message };
      }
    } catch (err) {
      toast.error(err.message);
      console.log("Login errror", err);
    }
  },

  async fetchUserInfo() {
    try {
      const { accessToken } = get();

      if (accessToken) {
        const res = await axiosInstance.get("/api/auth/getProfile");

        set({ user: res.data[0] });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async logout(navigate) {
    try {
      const res = await axiosInstance.post("/api/auth/logout");

      console.log({ res });

      window.localStorage.removeItem("accessToken");

      // await account.deleteSession("current");

      socket.disconnect();

      navigate("/login");

      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  },

  setUser: async (userData) => {
    set({ user: userData });
  },

  async getAllUsers() {
    try {
      const res = await axiosInstance.get("/api/auth/getAllUsers");

      set({ users: res.data });
    } catch (err) {
      console.log(err);
    }
  },
  async updateProfile(data) {
    try {
      const res = await axiosInstance.patch("/api/auth/updateProfile", data);

      if (res.data?.affected) {
        toast.success("Parol o'zgartirildi");
      } else {
        toast.error(res.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async deleteProfileImage() {
    try {
      const res = await axiosInstance.patch("/api/auth/deleteProfileImage");
      await get().fetchUserInfo();
    } catch (err) {
      console.log(err);
    }
  },
  async updateProfileImage(data) {
    try {
      const res = await axiosMultipartHeader.patch(
        "/api/auth/uploadProfileImage",
        data
      );

      console.log({ res });
    } catch (err) {
      console.log(err);
    }
  },
  async getOneUser(id) {
    try {
      const res = await axiosInstance.get("/api/auth/getOneUser/" + id);

      set({ profileUser: res.data[0] });
    } catch (err) {
      console.log(err);
    }
  },

  setOnlineUser: (userIds) =>
    set(() => {
      window.localStorage.setItem("online_users", JSON.stringify(userIds));
      return { onlineUsers: userIds };
    }),

  setOfflineUser: async (userId) => {
    set((prev) => ({
      onlineUsers: prev.onlineUsers?.filter((item) => item !== userId) || [],
    }));
  },
}));
