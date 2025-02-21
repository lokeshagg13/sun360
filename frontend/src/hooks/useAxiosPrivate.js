import { useEffect } from "react";

import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// Axios private hook for adding authorization to server calls for protected routes and in case the response returns
// 403 i.e forbidden, then create a new access token using refresh hook (refresh token called further)
function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  // Called whenever auth or refresh is changed
  useEffect(() => {
    // Intercepts an outgoing request called using axiosPrivate handle and adds Authorization header (with accessToken)
    // in its header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepts an incoming response received using axiosPrivate handle and if the response status is 403, then resend once
    // (one time retry is controlled by prevRequest.sent boolean value) after creating a new access token
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    // Cleaning up the interceptors at the time when the component is getting unmounted
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, auth]);

  return axiosPrivate;
}

export default useAxiosPrivate;
