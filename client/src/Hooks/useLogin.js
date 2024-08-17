const useLogin = async (formData) => {
  const url = `https://proxy.cors.sh/https://talkative-2ld0.onrender.com/api/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cors-api-key": "temp_94068ee2b87d497c7cb73e9f08550fa4", // cors.sh API key
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useLogin;
