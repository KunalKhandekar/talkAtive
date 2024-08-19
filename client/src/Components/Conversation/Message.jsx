import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../Zustand/useConversation";
import { IoCheckmarkDone } from "react-icons/io5";
import moment from "moment";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSocketContext } from "../../Context/SocketContext";

const Message = ({ message }) => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const Sender = authUser?._id == message?.senderId;
  const profilePic = Sender
    ? authUser?.profilePic
    : selectedConversation?.profilePic;

  const handleMessageDelete = (messageModel) => {
    console.log("message delete", messageModel);
    socket?.emit("Delete_Message", (messageModel));
  };

  return (
    <>
      {message.timelineLabel && (
        <div className="w-full flex items-center justify-center">
          <hr className="w-full border-slate-800" />
          <p className="text-slate-300 px-4">{message.timelineLabel}</p>
          <hr className="w-full border-slate-800" />
        </div>
      )}

      <div className={`chat ${Sender ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar hidden lg:block">
          <div className="w-10 rounded-full">
            <img alt="bubble" src={profilePic} />
          </div>
        </div>

        <div
          className={`chat-bubble ${
            message.imageURL || message.videoURL ? "p-1" : ""
          } ${
            Sender
              ? "bg-blue-700 text-white relative"
              : "text-white bg-slate-800"
          }`}
        >
          {Sender && (
            <div className="dropdown absolute top-[-10px] left-[-20px]">
              <div
                tabIndex={0}
                role="button"
                className="btn p-0 bg-transparent hover:bg-transparent border-none rounded-full"
              >
                <CiMenuKebab size={20} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-slate-800 rounded-box z-[1] w-auto h-auto shadow"
              >
                <li className="w-auto" onClick={() => handleMessageDelete(message)}>
                  <FaRegTrashAlt size={50} color="red" />
                </li>
              </ul>
            </div>
          )}
          {message?.imageURL && (
            <img
              src={message?.imageURL}
              alt={message?.message}
              className="h-64 w-auto rounded-xl"
            />
          )}
          {message?.videoURL && (
            <video
              controls
              src={message?.videoURL}
              alt={message?.message}
              className="aspect-video w-auto rounded-xl"
            />
          )}
          {message.message && (
            <p
              className={`${message.imageURL || message.videoURL ? "p-2" : ""}`}
            >
              {message?.message}
            </p>
          )}
        </div>
        <div className="chat-footer opacity-50 flex items-center gap-1 justify-center">
          <p>{moment(message.createdAt).format("hh:mm a")}</p>
          {Sender && (
            <div
              className={`text-lg ${
                message.seen.includes(message?.receiverId)
                  ? "text-[rgb(29,78,216)] font-semibold"
                  : "text-slate-200"
              }`}
              title={`${
                message.seen.includes(message?.receiverId) ? "seen" : "unseen"
              }`}
            >
              <IoCheckmarkDone />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Message;
