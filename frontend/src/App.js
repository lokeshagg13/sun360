import React from "react";

import { Routes, Route, Navigate } from "react-router-dom"; // Updated import
import Layout from "./components/basic-ui/elements/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RemindersPage from "./pages/RemindersPage";
import AddRemindersPage from "./pages/AddRemindersPage";
import SkinSpotPredPage from "./pages/SkinSpotPredPage";
import RequireAuth from "./components/user/RequireAuth";
import useAuth from "./hooks/useAuth";
import Page404 from "./pages/page404";

function App() {
  // For validating whether user is logged in or not
  const { auth } = useAuth();

  return (
    <main className="app">
      {/* Layout component for attaching navigation bar to the remaining app */}
      <Layout>
        <Routes>
          {/* For home (/) route, if user is logged in, then navigated to search app and if not logged in, then navigated to login page */}
          <Route exact path="/" element={<HomePage />} />

          {/* Global paths - login and signup */}
          <Route
            path="/login"
            element={
              auth?.accessID && auth?.accessToken ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/add-reminder" element={<AddRemindersPage />} />
            <Route
              path="/skin-spot-prediction"
              element={<SkinSpotPredPage />}
            />
          </Route>

          {/* Invalid Paths */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Layout>
    </main>
  );
}

export default App;
