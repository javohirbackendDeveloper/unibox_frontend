import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "./axios/axiosInstance";
import { AuthStore } from "./auth.store";
export const FriendshipStore = create((set, get) => ({
  chats: [],

  async createFriendship(data) {
    try {
      const res = await axiosInstance.post("/api/friendship", data);
      if (res.data?.success) {
        toast.success(res.data.message);
        const getAllUsers = AuthStore.getState().getAllUsers;
        await getAllUsers();
      } else {
        toast.error(res.data?.message);
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },
  async getMyFriends() {
    try {
      const res = await axiosInstance.get("/api/friendship/getAllMyFriends");

      if (res.data[0]) {
        set({ chats: res.data });
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },
}));
