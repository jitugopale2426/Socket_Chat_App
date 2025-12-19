import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { socket } from "../socket.js";
import axios from "axios";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = location.state;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatSessionId, setChatSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    

    const handleReceive =  (msg) => {
      if (
        msg.senderId === user.id
      )  return;
      
      if(msg.chatSessionId === chatSessionId){
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receiveMessage",handleReceive)

    return () => {
      socket.off("receiveMessage",handleReceive);
    };
  }, [chatSessionId, user.id]);

  useEffect(()=>{
    if (!user || !token) return;

    socket.auth = { token };
    socket.connect();

    socket.emit("addUser", user.id);

    return () =>{
      socket.disconnect();
    }
  },[user,token])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/getUser", {
          headers: {
            "auth-token": token,
          },
        });
        setUsers(res.data.user);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!chatSessionId || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/getMessages/${chatSessionId}`,
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [chatSessionId, token]);

  const formatTime = (dateString) =>{
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-IN",{
      hour:"numeric",
      minute:"2-digit",
      hour12:true
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatSessionId) return;

    const msg = {
      senderId: user.id,
      chatSessionId,
      text: newMessage,
    };

    socket.emit("sendMessage", msg);

    setMessages((prev) => [...prev, { ...msg, id: Date.now(), createdAt: new Date() }]);

    setNewMessage("");
  };
  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/4 border-r p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">Users</h2>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="space-y-2">
            {users
              .filter((u) => u.id !== user?.id)
              .map((u) => (
                <div
                  key={u.id}
                  className={`p-3 rounded-lg cursor-pointer hover-bg-blue transition ${
                    selectedUser?.id === u.id
                      ? "bg-blue-200 font-semibold"
                      : "bg-white"
                  }`}
                  onClick={async()=>{
                    setSelectedUser(u);
                    setMessages([]);
                    setChatSessionId(null);

                    const res = await axios.post("http://localhost:5000/api/chatSession/get-or-create",{
                      otherUserId:u.id
                    },{
                      headers:{
                        "auth-token":token
                      }
                    })

                    setChatSessionId(res.data.id)
                  }}
                >
                  {u.username}
                </div>
              ))}
          </div>
        </div>

        <div className="w-3/4 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4 p-2 flex flex-col gap-2 justify-center items-center">
            {selectedUser ? (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded max-w-[60%] flex flex-col ${
                    m.senderId === user?.id
                      ? "bg-blue-300 self-end items-end"
                      : "bg-gray-300 self-start items-start"
                  }`}
                >
                  <span>{m.text}</span>

                  <span className="text-xs text-gray-600 mt-1">
                    {m.createdAt ? formatTime(m.createdAt) : ""}
                  </span>
                  
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center text-xl">
                Welcome, {user?.username} ! <br />
                Select a user from the left to start chatting.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedUser && (
            <div className="flex mt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message to ${selectedUser.username}`}
                className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold cursor-pointer"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
