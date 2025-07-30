import { io } from "socket.io-client";

export const socket = io("https://unibox-backend.onrender.com", {
  autoConnect: false,
});
