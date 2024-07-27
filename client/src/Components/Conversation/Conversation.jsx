import { IoIosArrowBack } from "react-icons/io";
import MessageInput from "./MessageInput";
import useConversation from "../../Zustand/useConversation";
import NoConvo from "../../assets/NoConvo.png";
import useGetMessage from "../../Hooks/useGetMessage";
import Message from "./Message";
import { useSocketContext } from "../../Context/SocketContext";
import useListenMessage from "../../Hooks/useListenMessage";
import { useEffect, useRef } from "react";
import Typing from "./Typing";
import useDebounce from "../../Hooks/useDebouncing";

const Conversation = () => {
  const { selectedConversation, setSelectedConversation, typingUsers } =
    useConversation();
  const { messages, loading } = useGetMessage();
  const { onlineUsers } = useSocketContext();
  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers.includes(selectedConversation?._id);
  const isTyping = typingUsers[selectedConversation?._id];

  // Debounce the typing state
  const debouncedIsTyping = useDebounce(isTyping, 100);

  useListenMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && (messages.length > 0 || debouncedIsTyping !== undefined)) {
      scrollToBottom();
    }
  }, [loading, messages, debouncedIsTyping]);

  return (
    <>
      {selectedConversation ? (
        <div className="w-full h-full">
          <div className="h-20 flex items-center gap-3 p-2 px-6 border-b border-slate-800">
            <div
              className="p-1 bg-slate-800 rounded-full flex justify-center items-center cursor-pointer"
              onClick={() => setSelectedConversation(null)}
            >
              <IoIosArrowBack size={28} />
            </div>

            <div className="flex gap-4">
              <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className="w-16 rounded-full">
                  <img src={selectedConversation?.profilePic} alt="Profile" />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-lg font-semibold line-clamp-1">
                  {selectedConversation?.firstName +
                    " " +
                    selectedConversation?.lastName}
                </p>
                <p className="text-slate-400">
                  {debouncedIsTyping ? "typing..." : isOnline ? "online" : "offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="h-[calc(100vh-190px)] overflow-auto p-3">
            {loading && (
              <div className="h-full w-full flex items-center justify-center">
                <p className="loading loading-spinner"></p>
              </div>
            )}
            {!loading && messages.length > 0 && (
              <>
                {messages.map((message) => (
                  <Message message={message} key={message._id} />
                ))}
                {debouncedIsTyping && <Typing />}
                <div ref={messagesEndRef} />
              </>
            )}

            {!loading && messages.length === 0 && (
              <div className="h-full w-full flex items-start justify-center">
                <p className="text-slate-400 font-semibold text-center p-2 border border-slate-500 rounded-lg bg-slate-800">
                  Start a conversation with{" "}
                  <span className="text-blue-600">
                    {selectedConversation?.firstName}
                  </span>{" "}
                  by sending a message.
                </p>
              </div>
            )}
          </div>

          <div className="h-16 border-t border-slate-800">
            <MessageInput toUserId={selectedConversation?._id} />
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-full md:flex items-center justify-center hidden`}
        >
          <div className="text-center">
            <img
              src={NoConvo}
              alt="NoConvo"
              className="w-[300px] h-auto "
            />
            <p className="text-3xl font-semibold">Select a conversation</p>
            <p className="text-slate-400">to start messaging</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversation;
