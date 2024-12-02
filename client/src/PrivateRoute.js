import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user session exists
  const user = JSON.parse(sessionStorage.getItem("username"));

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
