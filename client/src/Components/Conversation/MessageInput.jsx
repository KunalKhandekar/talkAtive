import { RiAttachment2 } from "react-icons/ri";
import { LuSend } from "react-icons/lu";
import useSendMessage from "../../Hooks/useSendMessage";
import { useState } from "react";
import useConversation from "../../Zustand/useConversation";

const MessageInput = () => {
  const { sendMessage, loading } = useSendMessage();
  const { messages } = useConversation();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input) {
      sendMessage(input);
      setInput("");
    }
  };
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
          onChange={(e) => setInput(e.target.value)}
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
