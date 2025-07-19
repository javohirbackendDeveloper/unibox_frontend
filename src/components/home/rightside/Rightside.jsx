import { messages } from "../../../dummyData/user";
import React, { useState } from "react";
import "./Rightside.css";
import Chat from "./chat/Chat";

function Rigthside({ setSelectedChat, selectedChat }) {
  return (
    <div className="rightside">
      {selectedChat ? (
        <Chat setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
      ) : (
        <>
          <img className="rightside-logo" src="./logo.png" alt="" />
        </>
      )}
    </div>
  );
}

export default Rigthside;
