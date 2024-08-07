import { BsChatTextFill } from "react-icons/bs";
import { RiUserSearchFill } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import SidebarConversation from "./SidebarConversation";
import { useState } from "react";
import LogoutDialog from "../Dailog/LogoutDialog";
import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../Zustand/useConversation";
import SearchDialog from "../Dailog/SearchDialog";
const Sidebar = () => {
  const [openLogout, setOpenLogout] = useState(false);
  const [openSearch, setOpenSerach] = useState(false);
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  return (
    <div className={`w-full h-full grid grid-cols-[80px_1fr] ${selectedConversation !== null ? "hidden md:grid" : "grid"} transition-all`} >
      <div className="border-r border-slate-800">
        <div className="flex flex-col justify-between h-full w-full p-2 py-4 gap-2">
          <div className="flex flex-col gap-2">
            {/* Chats */}
            <div
              className="w-16 h-16 rounded-full hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title="Chats"
            >
              <BsChatTextFill size={30} />
            </div>

            {/* Search */}
            <div
              className="w-16 h-16 rounded-full hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title="Search"
              onClick={() => setOpenSerach(true)}
            >
              <RiUserSearchFill size={30} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Profile */}
            <div className="avatar m-1" title="Profile">
              <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
                <img src={authUser?.profilePic} />
              </div>
            </div>

            {/* Logout */}
            <div
              className="w-16 h-16 rounded-full hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title="Logout"
              onClick={() => setOpenLogout(true)}
            >
              <RiLogoutCircleLine size={30} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Loaded Conversations */}
      <SidebarConversation />


      {openLogout && <LogoutDialog onClose={() => setOpenLogout(false)} />}
    
      {openSearch && <SearchDialog onClose={() => setOpenSerach(false)} />}
    </div>
  );
};

export default Sidebar;
