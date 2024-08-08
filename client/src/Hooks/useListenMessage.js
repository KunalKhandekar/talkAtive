import { useEffect } from "react";
import useConversation from "../Zustand/useConversation";
import { useSocketContext } from "../Context/SocketContext";
import { markMessagesAsSeen } from "./useSeenMessage";
import { useAuthContext } from "../Context/AuthContext";

const useListenMessage = () => {
  const { messages, setMessages } = useConversation();
  const { socket } = useSocketContext();
  const { selectedConversation } =
    useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
    markMessagesAsSeen(selectedConversation?._id, authUser?._id);
    socket?.on("seenMessageUpdated", (newMessages) => {
      setMessages(newMessages);
    });
  }, [socket, selectedConversation]);

};

export default useListenMessage;
