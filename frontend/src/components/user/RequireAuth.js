import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Require Auth component to apply protection on URLs that must only be shown once user is logged in
function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();
  // If user is not logged it, then access to any protected route must be redirected to login page
  return (
    <>
      {auth?.accessID ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
}

export default RequireAuth;
