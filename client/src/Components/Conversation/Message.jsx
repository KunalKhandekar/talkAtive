import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../Zustand/useConversation";
import { IoCheckmarkDone } from "react-icons/io5";
import moment from "moment";

const Message = ({ message }) => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const Sender = authUser?._id == message?.senderId;
  const profilePic = Sender
    ? authUser?.profilePic
    : selectedConversation?.profilePic;

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
            Sender ? "bg-blue-700 text-white" : "text-white bg-slate-800"
          }`}
        >
          <p>{message?.message}</p>
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
