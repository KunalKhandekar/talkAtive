import { useEffect } from "react";
import { useSocketContext } from "../../Context/SocketContext";
import useGetConversation from "../../Hooks/useGetConversation";
import useConversation from "../../Zustand/useConversation";
import moment from "moment";
import { formatDate } from "../../Utils/dateFormater";

const SidebarConversation = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    typingUsers,
    setTypingUser,
    removeTypingUser,
  } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
  const { loading, users, setUsers } = useGetConversation();

  useEffect(() => {
    socket?.on(
      "conversationUpdated",
      ({ updatedConversation, unreadMessageCount }) => {
        setUsers((prevUsers) => {
          return prevUsers?.map((convo) =>
            convo.user._id === updatedConversation.participants[0]._id ||
            convo.user._id === updatedConversation.participants[1]._id
              ? {
                  ...convo,
                  lastMessage: {
                    message:
                      updatedConversation.messages[
                        updatedConversation.messages.length - 1
                      ].message,
                  },
                  lastMessageTime: updatedConversation.updatedAt,
                  unreadMessageCount: unreadMessageCount,
                }
              : convo
          );
        });
      }
    );

    socket?.on("new_Convo_Started", ({ conversations }) => {
      console.log(conversations);
      setUsers(conversations);
    })

    socket?.on("typing", ({ fromUserId }) => {
      setTypingUser(fromUserId, true);
    });

    socket?.on("stopTyping", ({ fromUserId }) => {
      removeTypingUser(fromUserId);
    });

    return () => {
      socket?.off("conversationUpdated");
      socket?.off("new_Convo_Started");
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket, setUsers, setTypingUser, removeTypingUser]);

  return (
    <div className=" w-full h-full border-r border-slate-800">
      <div className="p-3 border-b border-slate-800">
        <h1 className="text-2xl font-semibold">Conversations</h1>
      </div>

      {/* Loaded Conversations */}
      {loading ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <div className="flex flex-col gap-1.5 w-full h-[calc(100vh-109px)] md:h-[calc(100vh-112px)] p-1.5 overflow-auto">
          {users?.map((data) => {
            const isSelectedUser =
              selectedConversation?._id === data?.user?._id;
            const isOnline = onlineUsers.includes(data?.user?._id);
            const isTyping = typingUsers[data?.user?._id] || false;
            const unreadMsgCount = data?.unreadMessageCount;

            return (
              <div
                className={`w-full rounded-md p-3 border ${
                  isSelectedUser
                    ? "border-blue-600 bg-slate-800"
                    : "border-slate-800 hover:bg-slate-800"
                } `}
                key={data?.user?._id}
                onClick={() => setSelectedConversation(data?.user)}
              >
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className="w-16 rounded-full">
                      <img src={data?.user?.profilePic} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-lg font-semibold line-clamp-1">
                      {data?.user?.firstName + " " + data?.user?.lastName}
                    </p>
                    <div
                      className={`text-slate-400 line-clamp-1 flex items-center w-full ${
                        unreadMsgCount >= 1 ? "font-semibold text-zinc-300" : ""
                      }`}
                    >
                      {unreadMsgCount === 0
                        ? isTyping
                          ? "Typing..."
                          : data?.lastMessage?.message
                        : `${
                            unreadMsgCount > 4 ? "4+" : unreadMsgCount
                          } messages`}

                      <div className={`m-2 p-0.5 w-1 h-1 rounded-full ${unreadMsgCount >= 1 ? "bg-blue-700" : "bg-zinc-400"}`}></div>

                      <div>{formatDate(data?.lastMessageTime)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarConversation;
