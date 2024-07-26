import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../Zustand/useConversation";
import moment from "moment";

const Message = ({ message }) => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const Sender = authUser?._id == message?.senderId;
  const profilePic = Sender
    ? authUser?.profilePic
    : selectedConversation?.profilePic;

  return (
    <div className={`chat ${Sender ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar hidden lg:block">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble ${
          Sender ? "bg-blue-700 text-white" : "text-white bg-slate-800"
        }`}
      >
        <p>{message?.message}</p>
      </div>

      <div className="chat-footer opacity-50">
        {moment(message.createdAt).format("hh:mm a")}
      </div>
    </div>
  );
};

export default Message;
