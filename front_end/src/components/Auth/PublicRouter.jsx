import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // already logged in → don't allow login/signup
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
