import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import User from "../Views/User/userEnd.js";
import AdminPanel from "../Views/Admin/AdminPanel.js";
import Login from "./userLogin/userLogin.js";
import { AuthProvider, useAuth } from "./AuthContext/userAuthContext.js";
import Signup from "./userSignup/userSingup.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: "/user",
    element: (
      // <ProtectedRoute>
        <User />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <AdminPanel />,
  },
  {
    path: "/login",
    element: <Login />,

  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default AppRouter;
