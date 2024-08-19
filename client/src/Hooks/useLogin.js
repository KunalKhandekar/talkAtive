import { backendUrl } from "../Utils/constants";

const useLogin = async (formData) => {
  const url = `${backendUrl}/api/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useLogin;
