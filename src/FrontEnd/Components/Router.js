import { createBrowserRouter, RouterProvider } from "react-router-dom";
import User from "../Views/User/userEnd.js";
import AdminPanel from "../Views/Admin/AdminPanel.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <User />,
    },
    {
        path: "/admin",
        element: <AdminPanel />
    },
]);

function AppRouter () {
    return <RouterProvider router={router}/>;
}

export default AppRouter;