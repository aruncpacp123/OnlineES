// import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const user = JSON.parse(sessionStorage.getItem("username"));
//   const navigate = useNavigate();
//   // Check if user exists and their role matches the allowed roles
//   if (user && allowedRoles.includes(user.user_type)) {
//     return children;
//   }

//   // Redirect to login if not authorized
//   // return <Navigate to="/login" replace />;
//   navigate("/login");
// };

// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    // Get authentication and user info from context or state
    //const isAuthenticated = localStorage.getItem("isAuthenticated"); // Example: Replace with your actual logic
    const isAuthenticated = JSON.parse(sessionStorage.getItem("username"));
    const userRole = isAuthenticated ? isAuthenticated.userRole :"no" // Example: Replace with your actual logic
    
    const navigate = useNavigate();

    // Check if the user is authenticated
    if (!isAuthenticated) {
        // return <Navigate to="/login" replace />;
        navigate("/login");
    }

    // Check if the user has the required role
    if (!allowedRoles.includes(userRole)) {
        // return <Navigate to="/" replace />;
        navigate("/login");
    }

    // Render the child components if checks pass
    return children;
};

export default PrivateRoute;
