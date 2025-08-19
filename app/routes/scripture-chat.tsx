import { User, Bot, Send, UserStar, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Route } from "./+types/scripture-chat";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export async function loader({ params }: Route.LoaderArgs) {
  // Simulate fetching scripture data based on the ID from params
  const scriptureId = params.id;
  if (!scriptureId) {
    throw new Error("Scripture ID is required");
  }

  // Here you would typically fetch the scripture data from an API or database
  return {
    title: `Scripture ${scriptureId}`,
    verse: "John 3:16",
    version: "NIV",
  };
}

function scripturechat({ loaderData }: Route.ComponentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to the Scripture Chat! How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    console.log("Sending message:", inputMessage);
    if (inputMessage.trim() === "") return;

    setTimeout(() => {
      const newUserMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");
    }, 200);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text:
          "Thanks for your message! We'll get back to you shortly on your " +
          loaderData.title +
          " query.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: {
    toLocaleTimeString: (
      arg0: string,
      arg1: { hour: string; minute: string; hour12: boolean }
    ) => any;
  }) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="flex flex-col h-full w-full p-8">
        <div className="border border-gray-200 rounded-t-lg p-3 flex flex-row items-center space-x-4">
          <button
            onClick={handleGoBack}
            className={`inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2>{loaderData.verse}</h2>
            <p>Book Version: {loaderData.version}</p>
          </div>
        </div>
        <div className="flex flex-row h-full w-full">
          <div className="w-1/4 border border-gray-200 rounded-bl-lg p-3">
            admins posts
          </div>
          <div className="flex flex-col justify-between w-full bg-transparent rounded-br-lg shadow-lg border border-gray-200">
            {/* Messages Area */}
            <div className="flex-1 overflow-auto space-y-4 p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col items-start space-x-3`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-8 w-full rounded-t-xl flex items-center px-5 flex-shrink-0 ${
                      message.sender === "user" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <>
                        <User className="w-5 h-5 mx-2 text-white" />
                        Test user
                      </>
                    ) : (
                      <>
                        <UserStar className="w-5 h-5 mx-2 text-white" />
                        Admin
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`w-full ${message.sender === "user" ? "text-right" : ""}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-b-xl shadow-sm bg-white text-gray-800 border border-gray-200`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : ""}`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-transparent border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="text-black p-2 w-full bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ""}
                  className={`p-4 rounded-full transition-colors duration-200 ${
                    inputMessage.trim() === ""
                      ? "bg-gray-300 text-blue-950 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default scripturechat;
