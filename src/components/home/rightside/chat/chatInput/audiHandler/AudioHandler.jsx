import { Mic, Trash, Pause, Play, Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import "./AudioHandler.css";
import { ChatStore } from "../../../../../../stores/chat.store";

function AudioHandler({ close, friendshipId }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [waveData, setWaveData] = useState([5, 5, 5, 5]);
  const { sendMessage } = ChatStore();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationIdRef = useRef(null);
  const audioRef = useRef(null);
  const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
  const updateWave = () => {
    if (
      analyserRef.current &&
      dataArrayRef.current &&
      isRecording &&
      !isPaused
    ) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const step = Math.floor(dataArrayRef.current.length / 4);
      const newData = [
        dataArrayRef.current[step],
        dataArrayRef.current[step * 2],
        dataArrayRef.current[step * 3],
        dataArrayRef.current[step * 4],
      ];
      setWaveData(newData.map((v) => Math.max(5, v / 2)));
      animationIdRef.current = requestAnimationFrame(updateWave);
    }
  };

  const startRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      audioContextRef.current?.close();
    }

    setAudioUrl(null);
    audioChunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    dataArrayRef.current = new Uint8Array(
      analyserRef.current.frequencyBinCount
    );

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);

    updateWave();
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(true);
      cancelAnimationFrame(animationIdRef.current);
      audioContextRef.current?.close();
    }
  };

  const playAudio = () => {
    if (audioRef.current) audioRef.current.play();
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const handleSend = () => {
    const formData = new FormData();

    if (audioBlob && friendshipId) {
      formData.append("file", audioBlob, "recording.webm");
      formData.append("friendship", friendshipId);
      sendMessage(formData, friendshipId);
      close(false);
    }
  };

  return (
    <div className="audio-handler">
      <button className="audio-btn mic-btn" onClick={startRecording}>
        <Mic />
      </button>

      <div className="audio-wave">
        {isRecording ? (
          waveData.map((h, i) => <span key={i} style={{ height: `${h}px` }} />)
        ) : isPaused && audioUrl ? (
          <button className="audio-btn play-btn" onClick={playAudio}>
            <Play />
          </button>
        ) : (
          <div className="wave-placeholder"></div>
        )}
      </div>

      {isRecording && (
        <button className="audio-btn pause-btn" onClick={pauseRecording}>
          <Pause />
        </button>
      )}

      <button className="audio-btn delete-btn" onClick={() => close(false)}>
        <Trash />
      </button>
      <button className="btn" onClick={handleSend} disabled={!audioUrl}>
        <Send className={audioUrl ? "active" : "icon"} />
      </button>
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
    </div>
  );
}

export default AudioHandler;
