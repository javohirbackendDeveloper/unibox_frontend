import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance, axiosMultipartHeader } from "./axios/axiosInstance";
import { AuthStore } from "./auth.store";
import { socket } from "../socket";
export const ChatStore = create((set, get) => ({
  messages: [],

  async sendMessage(data, friendshipId) {
    try {
      const res = await axiosMultipartHeader.post("/api/message", data);

      if (res.data?.id) {
        socket.emit("send_message", {
          text: res.data.text,
          friendship: friendshipId,
          senderId: res.data.sender.id,
          file: res.data.image,
        });

        await get().getMessages(friendshipId);
      }
    } catch (err) {
      console.log("send message errror", err);
    }
  },

  async getMyFriends() {
    try {
      const res = await axiosInstance.get("/api/friendship/getAllMyFriends");

      console.log({ res });

      if (res.data[0]) {
        set({ chats: res.data });
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async getMessages(friendshipId) {
    try {
      const res = await axiosInstance.get("/api/message/" + friendshipId);

      if (res.data[0]) {
        set({ messages: res.data });
      }
    } catch (err) {
      console.log("friendship errror", err);
    }
  },

  async clearMessages() {
    set({ messages: [] });
  },

  listenToMessages(friendshipId) {
    socket.off("receive_message");

    socket.on("receive_message", (message) => {
      if (message.friendship === friendshipId) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });
  },
}));
