import { useEffect } from "react";
import useConversation from "../Zustand/useConversation";
import { useSocketContext } from "../Context/SocketContext";

const useListenMessage = () => {
  const { messages, setMessages } = useConversation();
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
  }, [socket, setMessages, messages]);
};

export default useListenMessage;
