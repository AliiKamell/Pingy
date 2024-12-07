import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { friend } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const user = localStorage.getItem("userInfo");
  const userName = JSON.parse(user).name;

  useEffect(() => {
    axios
      .post("/api/user/chat", {
        username: userName,
        friend: friend,
      })
      .then((res) => {
        console.log(res.data);
        setConversation(res.data);
      })
      .catch((e) => {
        console.log("Cant fetch Chat ", e);
      });
  }, [conversation]);

  const sendMessage = (messageData) => {
    document.getElementById("message-to-send").value = "";
    socket.on("newmessage", function (data) {
      addMessages(data);
      function addMessages(message) {
        document.getElementById("messages").append(<p>{message.message}</p>);
      }
    });

    axios
      .post(
        "/api/user/messages",
        {
          username: messageData.user,
          friend: messageData.friend,
          message: messageData.message,
        },
        {
          withCredentials: true,
          crossdomain: true,
        }
      )
      .then((res) => {})
      .catch((e) => {
        console.log("Can't Register ", e);
      });
  };

  return (
    <div className="main">
      <div className="settings">
        <button id="logout-button" onClick={() => navigate("/")}>
          Logout
        </button>
        <button id="back" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </div>

      <div className="chatWindow">
        <div className="chats-container">
          <div className="chat-window">
            <div className="chat-header">
              <img
                src="https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png"
                alt="avatar"
              />
              <div className="friend-name">{friend}</div>
            </div>

            <div className="chat-history">
              <ul className="chat-ul-history">
                {conversation.map((message, key) => {
                  return (
                    <li id="messages" className="message-list" key={key}>
                      {message.sender === user ? (
                        <>
                          <div className="message-data align-right">
                            <span className="message-data-time">
                              {message.dateCreated}
                            </span>
                            <span className="message-data-name">
                              {message.sender}
                            </span>
                          </div>
                          <div className="message other-message float-right">
                            {message.message}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="message-data">
                            <span className="message-data-name">
                              <i className="fa fa-circle online"></i>
                              {message.sender}
                            </span>
                            <span className="message-data-time">
                              {message.dateCreated}
                            </span>
                          </div>
                          <div className="message my-message">
                            {message.message}
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="send-message">
              <textarea
                className="message-to-send"
                id="message-to-send"
                placeholder="Type your message"
                rows="3"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
              <Button
                onClick={() => sendMessage({ user, friend, message })}
                className="btn btn-primary send-button"
              >
                <i className="fas fa-paper-plane"></i> Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
