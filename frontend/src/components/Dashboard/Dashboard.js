
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Get user info from local storage
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }

        // Fetch friends from the API
        const { data } = await axios.get("/api/user/friends");
        const friendNames = data.users.map((user) => user.name);
        setFriends(friendNames);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);


  return (
    <div className="dash">
      <h1>Hello {user?.name || "Guest"}</h1>

      <div
        className="logout"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        <h4>Sign Out</h4>
      </div>
      <div className="welcome-message">
        <h3>Live Chat Now With Your Friends</h3>
      </div>
      <div className="friends-dashboard-container">
        <p className="chatsp">Chats</p>
        {friends.length > 0 ? (
          friends.map((friend, key) => (
            <div
              key={key}
              className="dashboard-friend-box"
              onClick={() => navigate(`/chat/${friend}`)}
            >
              <img
                className="friendAvatar"
                src="https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png"
                alt="Avatar"
              />
              <div className="dashboard-text">
                <p className="dashboard-friendName">{friend}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="noFriends">You have no friends</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
