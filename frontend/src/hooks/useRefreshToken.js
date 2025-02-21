import axios from "../api/axios";
import useAuth from "./useAuth";

// Use refresh Token custom hook
function useRefreshToken() {
  const { setAuth } = useAuth();

  // This hook provides a refresh function which calls the backend server for creating a new access token using the
  // refresh token (useful when a page is refreshed or current access token is expired)
  const refresh = async () => {
    const response = await axios.get("/api/user/refreshSession", {
      withCredentials: true,
    });
    // Set new auth access token and email
    setAuth({
      email: response.data.email,
      accessToken: response.data.accessToken,
    });
    return response.data.accessToken;
  };

  // Return this function to where this hook is used
  return refresh;
}

export default useRefreshToken;
