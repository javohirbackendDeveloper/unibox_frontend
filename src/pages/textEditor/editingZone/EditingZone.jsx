import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { socket } from "../../../socket";
import "./EditingZone.css";
import jsPDF from "jspdf";
import { TOOLBAR_OPTIONS } from "../../../dummyData/textEditor";

const SAVE_INTERVAL_MS = 2000;

export default function EditingZone() {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);

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

  return (
    <div className="container">
      <div ref={wrapperRef}></div>
      <div className="button-group">
        <button onClick={generatePdf} className="download-btn">
          ⬇ Yuklab olish
        </button>
        <button className="contact-btn">📇 Kontaktlarni qo'shish</button>
      </div>
    </div>
  );
}
