import { useSocketContext } from "../../Context/SocketContext";
import useGetConversation from "../../Hooks/useGetConversation";
import useConversation from "../../Zustand/useConversation";

const SidebarConversation = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const { loading, users } = useGetConversation();
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
            const isSelectedUser = selectedConversation?._id === data?.user?._id;
            const isOnline = onlineUsers.includes(data?.user?._id);
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
                    <p className="text-slate-400 line-clamp-1">{data?.lastMessage?.message}</p>
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
