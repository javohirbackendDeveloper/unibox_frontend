import React, { useState } from "react";
import Leftside from "./leftside/Leftside";
import Rightside from "./rightside/Rightside";
import "./Home.css";

function Home() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="home">
      <div className={`leftside ${selectedChat ? "hide-on-mobile" : ""}`}>
        <Leftside
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </div>

      <div
        className={`rightside ${
          selectedChat ? "show-on-mobile" : "hide-on-mobile"
        }`}
      >
        <Rightside
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </div>
    </div>
  );
}

export default Home;
