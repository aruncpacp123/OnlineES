import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("username"));

  // Check if user exists and their role matches the allowed roles
  if (user && allowedRoles.includes(user.user_type)) {
    return children;
  }

  // Redirect to login if not authorized
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
