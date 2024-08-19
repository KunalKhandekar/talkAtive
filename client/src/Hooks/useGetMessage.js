import { useEffect, useState } from "react";
import useConversation from "../Zustand/useConversation";
import { backendUrl } from "../Utils/constants";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      const url = `${backendUrl}/api/chat/${
        selectedConversation?._id
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.Messages);
    } else {
        setMessages([]);
      }
      setLoading(false);
    };

    if (selectedConversation?._id) {
      getMessage();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading, setMessages };
};

export default useGetMessage;
