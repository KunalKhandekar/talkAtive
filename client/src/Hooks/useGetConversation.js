import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getConversation = async () => {
    setLoading(true);
    const url = `http://localhost:8000/api/user/conversation`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      setUsers(data.users);
    } else {
      if (data?.message === "Session timeout, Login again !!") {
        localStorage.removeItem("user");
        navigate("/login");
      }
      console.log(data);
      toast.error(data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getConversation();
  }, []);

  return {
    loading,
    users,
    setUsers,
  };
};

export default useGetConversation;
