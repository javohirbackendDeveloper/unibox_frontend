import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "./axios/axiosInstance";
import { AuthStore } from "./auth.store";
import { socket } from "../socket";
export const FriendshipStore = create((set, get) => ({
  chats: [],
  contacts: [],
  unReadInvites: null,

  async createFriendship(data) {
    try {
      const res = await axiosInstance.post("/api/friendship", data);

      if (res.data?.success) {
        socket.emit("send_invite", {
          receiverId: data.user2,
          senderId: AuthStore.getState().user?.id,
          senderName:
            AuthStore.getState().user?.name || AuthStore.getState().user?.email,
        });
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
  async getMyContacts() {
    try {
      const res = await axiosInstance.get("/api/friendship/getMyContacts");

      set({ contacts: res.data });
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async acceptInvite(friendshipId) {
    try {
      const res = await axiosInstance.patch("/api/friendship/" + friendshipId);
      if (res.data?.affected) {
        toast.success("Taklif qabul qilindi");
        await get().getMyContacts();
        await get().getMyFriends();
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async cancelInvite(friendshipId) {
    try {
      const res = await axiosInstance.delete("/api/friendship/" + friendshipId);

      if (res.data?.affected) {
        toast.success("Muvaffaqiyatli o'chirildi");
        await get().getMyContacts();
        await get().getMyFriends();
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async getUnreadInvites() {
    try {
      const res = await axiosInstance.get("/api/friendship/getUnreadInvites");
      console.log({ res });

      if (res.data?.[0]?.id) {
        set({ unReadInvites: res.data });
      } else {
        set({ unReadInvites: [] });
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async updateRead() {
    try {
      const res = await axiosInstance.patch("/api/friendship/updateRead");

      await get().getUnreadInvites();
    } catch (err) {
      console.log("friendship errror", err);
    }
  },
}));

socket.on("new_invitation", (invite) => {
  toast.info(`Yangi chat taklifi: ${invite.senderName}`);

  FriendshipStore.getState().getUnreadInvites();

  const audio = new Audio("/sounds/smsAudio.wav");
  audio.play();
});
