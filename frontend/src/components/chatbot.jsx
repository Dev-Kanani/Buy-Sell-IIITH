// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ChatBot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const [user, setUser] = React.useState(null);

//   const [email, setEmail] = React.useState("");

//   const goto = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       axios
//         .get("http://localhost:5000/api/currentUser", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           console.log("User data:", response.data);
//           console.log("Email:", response.data.email);
//           setEmail(response.data.email);
//         })
//         .catch((error) => {
//           console.error("Error fetching user data:", error);
//         });

//       console.log("User:", user);
//     }

//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }
//   }, []);

//   useEffect(() => {
//     console.log("Email:", email);
//     if (email)
//       axios
//         .get(`http://localhost:5000/api/getUser?email=${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
//         .then((response) => {
//           setUser(response.data);
//         })
//         .catch((error) => console.error(error));
//   }, [email]);



//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages([...messages, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     // console.log(user.userId);
//     console.log(user);

//     const passUserId = user ? user._id : null;

//     console.log("User ID:", passUserId);

//     try {
//       const response = await axios.post("http://localhost:5000/api/chatbot", {
//         message: input, userId: passUserId
//       });

//       const botMessage = { sender: "bot", text: response.data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Sorry, I'm having trouble connecting right now." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>
//         {`
//           .chatbot-container {
//             display: flex;
//             flex-direction: column;
//             height: 100vh;
//             background-color: #f5f7fb;
//             font-family: 'Segoe UI', 'Roboto', sans-serif;
//           }

//           .chat-header {
//             background-color: white;
//             padding: 1.5rem;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           }

//           .chat-header h2 {
//             margin: 0;
//             color: #1a1a1a;
//             font-size: 1.5rem;
//             font-weight: 600;
//           }

//           .messages-container {
//             flex: 1;
//             overflow-y: auto;
//             padding: 2rem;
//             display: flex;
//             flex-direction: column;
//             gap: 1rem;
//           }

//           .message {
//             max-width: 80%;
//             padding: 1rem 1.5rem;
//             border-radius: 1rem;
//             animation: fadeIn 0.3s ease-in-out;
//             line-height: 1.5;
//             position: relative;
//           }

//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }

//           .user-message {
//             background-color: #2563eb;
//             color: white;
//             align-self: flex-end;
//             border-bottom-right-radius: 0.25rem;
//           }

//           .bot-message {
//             background-color: white;
//             color: #1a1a1a;
//             align-self: flex-start;
//             border-bottom-left-radius: 0.25rem;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           }

//           .input-container {
//             background-color: white;
//             padding: 1.5rem;
//             box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
//             display: flex;
//             gap: 1rem;
//           }

//           .message-input {
//             flex: 1;
//             padding: 0.75rem 1rem;
//             border: 2px solid #e5e7eb;
//             border-radius: 0.5rem;
//             font-size: 1rem;
//             transition: all 0.2s ease;
//             outline: none;
//           }

//           .message-input:focus {
//             border-color: #2563eb;
//             box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
//           }

//           .send-button {
//             padding: 0.75rem 2rem;
//             background-color: #2563eb;
//             color: white;
//             border: none;
//             border-radius: 0.5rem;
//             font-size: 1rem;
//             font-weight: 500;
//             cursor: pointer;
//             transition: all 0.2s ease;
//           }

//           .send-button:hover {
//             background-color: #1d4ed8;
//           }

//           .send-button:disabled {
//             background-color: #93c5fd;
//             cursor: not-allowed;
//           }

//           .loading-dots {
//             display: flex;
//             gap: 0.5rem;
//             padding: 1rem 1.5rem;
//             background-color: white;
//             border-radius: 1rem;
//             align-self: flex-start;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           }

//           .dot {
//             width: 8px;
//             height: 8px;
//             background-color: #2563eb;
//             border-radius: 50%;
//             animation: bounce 1.4s infinite ease-in-out;
//           }

//           .dot:nth-child(1) { animation-delay: -0.32s; }
//           .dot:nth-child(2) { animation-delay: -0.16s; }

//           @keyframes bounce {
//             0%, 80%, 100% { transform: scale(0); }
//             40% { transform: scale(1); }
//           }

//           /* Custom scrollbar */
//           .messages-container::-webkit-scrollbar {
//             width: 6px;
//           }

//           .messages-container::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .messages-container::-webkit-scrollbar-thumb {
//             background-color: rgba(0, 0, 0, 0.2);
//             border-radius: 3px;
//           }
//         `}
//       </style>

//       <div className="chatbot-container">
//         <div className="messages-container">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`message ${msg.sender === "user" ? "user-message" : "bot-message"
//                 }`}
//             >
//               {msg.text}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="loading-dots">
//               <div className="dot"></div>
//               <div className="dot"></div>
//               <div className="dot"></div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="input-container">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type your message..."
//             className="message-input"
//           />
//           <button
//             onClick={sendMessage}
//             disabled={isLoading || !input.trim()}
//             className="send-button"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatBot;


import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBCardFooter,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import axios from "axios";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || []
  );

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = React.useState(null);

  const [email, setEmail] = React.useState("");

  const goto = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/currentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("User data:", response.data);
          console.log("Email:", response.data.email);
          setEmail(response.data.email);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      console.log("User:", user);
    }

    if (!token) {
      window.location.href = "/login";
      return;
    }
  }, []);

  useEffect(() => {
    console.log("Email:", email);
    if (email)
      axios
        .get(`http://localhost:5000/api/getUser?email=${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.error(error));
  }, [email]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    // setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    const passUserId = user ? user._id : null;

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: input, userId: passUserId, chatHistory: messages
      });

      const botMessage = {
        sender: "bot",
        text: response.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
      };

      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      localStorage.setItem("chatMessages", JSON.stringify(newMessages));
      // setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting right now.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'Short' })
      };
      // setMessages((prev) => [...prev, errorMessage]);
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      localStorage.setItem("chatMessages", JSON.stringify(newMessages));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("chatMessages");
    };
  }, []);

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="8" lg="6" xl="4">
          <MDBCard>
            <MDBCardHeader
              className="d-flex justify-content-between align-items-center p-3"
              style={{ borderTop: "4px solid #ffa900" }}
            >
              <h5 className="mb-0">Chat messages</h5>
              <div className="d-flex flex-row align-items-center">
                <span className="badge bg-warning me-3">{messages.length}</span>
                <MDBIcon
                  fas
                  icon="minus"
                  size="xs"
                  className="me-3 text-muted"
                />
                <MDBIcon
                  fas
                  icon="comments"
                  size="xs"
                  className="me-3 text-muted"
                />
                <MDBIcon
                  fas
                  icon="times"
                  size="xs"
                  className="me-3 text-muted"
                />
              </div>
            </MDBCardHeader>
            <MDBContainer style={{ position: "relative", height: "400px", overflowY: "auto" }}>
              <MDBCardBody>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between">
                      <p className="small mb-1">
                        {msg.sender === "user" ? "You" : "Bot"}
                      </p>
                      <p className="small mb-1 text-muted">
                        {msg.date} {msg.time}
                      </p>
                    </div>
                    <div
                      className={`d-flex flex-row ${msg.sender === "user"
                        ? "justify-content-end"
                        : "justify-content-start"
                        } mb-4 pt-1`}
                    >
                      {msg.sender === "bot" && (
                        <img
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                      )}
                      <div>
                        <p
                          className={`small p-2 ${msg.sender === "user"
                            ? "me-3 text-white bg-warning"
                            : "ms-3 bg-light"
                            } rounded-3 mb-3`}
                        >
                          {msg.text}
                        </p>
                      </div>
                      {msg.sender === "user" && (
                        <img
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="d-flex justify-content-start">
                    <div className="small p-2 ms-3 bg-light rounded-3">
                      Typing...
                    </div>
                  </div>
                )}
              </MDBCardBody>
            </MDBContainer>
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <MDBInputGroup className="mb-0">
                <input
                  className="form-control"
                  placeholder="Type message"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <MDBBtn
                  color="warning"
                  style={{ paddingTop: ".55rem" }}
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                >
                  Send
                </MDBBtn>
              </MDBInputGroup>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}