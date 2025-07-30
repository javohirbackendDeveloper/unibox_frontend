import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { socket } from "../../../socket";
import "./EditingZone.css";
import jsPDF from "jspdf";
import { TOOLBAR_OPTIONS } from "../../../dummyData/textEditor";
import { Dialog } from "@mui/material";
import { X } from "lucide-react";
import { FriendshipStore } from "../../../stores/friendshipStore";
import { AuthStore } from "../../../stores/auth.store";
import dayjs from "dayjs";
import { ChatStore } from "../../../stores/chat.store";
import { toast } from "sonner";

const SAVE_INTERVAL_MS = 2000;

export default function EditingZone() {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);
  const [openContactModal, setOpenContactModal] = useState(false);
  const { getMyFriends, chats } = FriendshipStore();
  const { onlineUsers, user, fetchUserInfo } = AuthStore();
  const { sendMessage } = ChatStore();

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  const generatePdf = () => {
    if (!quill) return;

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    doc.html(quill.root, {
      x: 40,
      y: 40,
      callback: (doc) => {
        doc.save("Unibox_saytidan_yuklangan_file.pdf");
      },
      autoPaging: "text",
      html2canvas: {
        scale: 0.8,
        useCORS: true,
      },
    });
  };

  useEffect(() => {
    getMyFriends();
  }, []);

  const sendDocumentUrl = async (friendship) => {
    const currentUrl = window.location.href;
    const res = await sendMessage(
      { text: currentUrl, friendship: friendship?.id },
      { friendshipId: friendship?.id }
    );

    if (res) {
      toast.success("Link yuborildi");
    }
  };

  return (
    <div className="container">
      <div ref={wrapperRef}></div>
      <div className="button-group">
        <button onClick={generatePdf} className="download-btn">
          ⬇ Yuklab olish
        </button>
        <button
          className="contact-btn"
          onClick={() => setOpenContactModal(!openContactModal)}
        >
          📇 Kontaktlarni qo'shish
        </button>
      </div>

      <Dialog
        open={openContactModal}
        onClose={setOpenContactModal}
        PaperProps={{ className: "editing-dialog-paper" }}
      >
        <div className="editing-dialog">
          <X
            onClick={() => setOpenContactModal(false)}
            className="close-icon"
          />
          <span className="dialog-title">Kontaktlar</span>

          {chats.length > 0 ? (
            <div className="editing-chat-list">
              {chats.map((chat, idx) => (
                <div className="editing-chat-item" key={idx}>
                  <div className="editing-avatar-wrapper">
                    <img
                      src={chat?.user?.image || "/avatar.png"}
                      alt="avatar"
                      className="editing-avatar"
                    />
                    {onlineUsers.includes(chat?.user?.id) && (
                      <span className="editing-online-indicator"></span>
                    )}
                  </div>

                  <div className="editing-chat-content">
                    <div className="editing-chat-info">
                      <p className="editing-chat-name">
                        {chat?.user?.name ||
                          chat?.user?.email?.split("@")[0] ||
                          "Private chat"}
                      </p>
                      <div className="editing-chat-meta">
                        {chat?.user?.id === user?.id && (
                          <CheckCheck className="check-icon" size={14} />
                        )}
                        <span className="editing-chat-time">
                          {dayjs(chat?.friendship?.createdAt).format("HH:mm")}
                        </span>
                      </div>
                    </div>
                    <button
                      className="editing-send-btn"
                      onClick={() => sendDocumentUrl(chat?.friendship)}
                    >
                      Yuborish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="editing-no-chat">Hozircha chatlar mavjud emas</div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
