const useLogout = async (userId) => {
  const url = `http://localhost:8000/api/auth/logout`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default useLogout;
