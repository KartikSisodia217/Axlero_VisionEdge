import { useState } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import Dashboard from "../pages/Dashboard";
import UserManagement from "../components/UserManagement";
import StreamManagement from "../components/StreamManagement";

import Analytics from "../pages/Analytics";
import Logs from "../pages/Logs";
import Settings from "../pages/Settings";

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "users":
        return <UserManagement />;

      case "streams":
        return <StreamManagement />;

      case "analytics":
        return <Analytics />;

      case "logs":
        return <Logs />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
      }}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar />

        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          {renderPage()}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;