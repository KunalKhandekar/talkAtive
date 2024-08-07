import { RiAttachment2 } from "react-icons/ri";
import { LuSend } from "react-icons/lu";
import useSendMessage from "../../Hooks/useSendMessage";
import { useState, useEffect } from "react";
import useConversation from "../../Zustand/useConversation";
import { useSocketContext } from "../../Context/SocketContext";

const MessageInput = ({ toUserId }) => {
  const { socket } = useSocketContext();
  const { sendMessage, loading } = useSendMessage();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;

  const handleSubmit = (e) => {
    e.preventDefault();

    const validInput = input.trim();

    if (validInput === "") {
      setInput("");
      return;
    }

    if (input) {
      sendMessage(input);
      setInput("");
      clearTimeout(typingTimeout);
      setIsTyping(false);
      socket.emit("stopTyping", { toUserId }); // Ensure typing status stops
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { toUserId });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", { toUserId });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearTimeout(typingTimeout);
      if (isTyping) {
        socket.emit("stopTyping", { toUserId });
      }
    };
  }, [toUserId, isTyping, socket]);

  return (
    <div className="h-full w-full flex items-center p-2 gap-3">
      <div className="p-2 bg-slate-800 rounded-full shadow-md">
        <RiAttachment2 size={24} />
      </div>
      <form className="w-full flex items-center gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type here"
          value={input}
          onChange={handleInputChange}
          className="input input-ghost w-full bg-slate-950 outline-none"
        />
        <button
          type="submit"
          className="btn hover:bg-blue-800 bg-blue-700 text-white"
          disabled={loading || !input}
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <LuSend size={25} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
