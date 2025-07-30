import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance, axiosMultipartHeader } from "./axios/axiosInstance";
import { AuthStore } from "./auth.store";
import { socket } from "../socket";
export const ChatStore = create((set, get) => ({
  messages: [],

  async sendMessage(data, friendshipId) {
    try {
      console.log({ data });

      const res = await axiosMultipartHeader.post("/api/message", data);

      if (res.data?.id) {
        socket.emit("send_message", {
          text: res.data.text,
          friendship: friendshipId,
          senderId: res.data.sender.id,
          file: res.data.image,
          voice: res.data?.voice,
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
        ChatStore.setState((state) => {
          const updated = res.data.map((msg) => {
            const existing = state.messages.find((m) => m.id === msg.id);
            return existing?.isRead ? { ...msg, isRead: true } : msg;
          });
          return { messages: updated };
        });
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

socket.off("messages_read").on("messages_read", ({ friendshipId }) => {
  ChatStore.setState((state) => {
    const updated = state.messages.map((msg) =>
      msg.friendship === friendshipId || msg.friendship?.id === friendshipId
        ? { ...msg, isRead: true }
        : msg
    );
    return { messages: updated };
  });
});
