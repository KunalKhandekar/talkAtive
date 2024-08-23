import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { useAuthContext } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./Pages/ForgotPassword";
import NewPassword from "./Pages/NewPassword";

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/register"
          element={authUser ? <Navigate to={"/"} /> : <Register />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={authUser ? <Navigate to={"/"} /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={authUser ? <Navigate to={"/"} /> : <NewPassword />}
        />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
