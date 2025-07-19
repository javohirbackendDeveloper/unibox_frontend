import React, { useState } from "react";
import Leftside from "./leftside/Leftside";
import "./Home.css";
import Rigthside from "./rightside/Rightside";
function Home() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="home">
      <div className="leftside">
        <Leftside
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </div>
      <div className="rightside">
        <Rigthside
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </div>
    </div>
  );
}

export default Home;
