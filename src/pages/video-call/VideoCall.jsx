import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { axiosInstance } from "../../stores/axios/axiosInstance";
import { AuthStore } from "../../stores/auth.store";

function randomID(len = 5) {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const { user, fetchUserInfo } = AuthStore();
  const callContainerRef = React.useRef(null);

  let roomID = getUrlParams().get("roomID");
  if (!roomID) {
    roomID = randomID(5);
    const newURL = `${window.location.origin}${window.location.pathname}?roomID=${roomID}`;
    window.history.replaceState(null, "", newURL);
  }

  React.useEffect(() => {
    fetchUserInfo();
  }, []);

  React.useEffect(() => {
    const initMeeting = async () => {
      if (!user?.id || !callContainerRef.current) return;

      try {
        const res = await axiosInstance.get("/api/zego?userId=" + user.id);
        const { token, appID } = res.data;
        const username = user.name || user.email.split("@")[0];

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          String(user.id),
          username
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: callContainerRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
        });
      } catch (error) {
        console.error("Failed to initialize Zego meeting:", error);
      }
    };

    initMeeting();
  }, [user, roomID]);

  return (
    <div
      className="myCallContainer"
      ref={callContainerRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
