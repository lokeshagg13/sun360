import { createContext, useState } from "react";

const AuthContext = createContext({});

// Auth Provider is a global state manager (context) that allows to check whether user is logged in or not and set their
// authentication status from anythere within the AuthProvider wrapped components
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
