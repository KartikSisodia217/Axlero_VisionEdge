import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import VideocamIcon from "@mui/icons-material/Videocam";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      id: "users",
      text: "Users",
      icon: <PeopleIcon />,
    },
    {
      id: "streams",
      text: "Streams",
      icon: <VideocamIcon />,
    },
    {
      id: "analytics",
      text: "Analytics",
      icon: <AnalyticsIcon />,
    },
    {
      id: "logs",
      text: "Logs",
      icon: <ArticleIcon />,
    },
    {
      id: "settings",
      text: "Settings",
      icon: <SettingsIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#111827",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
      <Box>

        <Typography
          variant="h5"
          align="center"
          sx={{
            py: 4,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          VisionEdge
        </Typography>

        <Divider sx={{ bgcolor: "#374151" }} />

        <List sx={{ mt: 2 }}>

          {menuItems.map((item) => (

            <ListItemButton
              key={item.id}
              selected={activePage === item.id}
              onClick={() => setActivePage(item.id)}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,

                "&.Mui-selected": {
                  bgcolor: "#2563eb",
                },

                "&.Mui-selected:hover": {
                  bgcolor: "#2563eb",
                },

                "&:hover": {
                  bgcolor: "#1f2937",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.text} />

            </ListItemButton>

          ))}

        </List>

      </Box>

      <Box sx={{ p: 3 }}>

        <Divider sx={{ bgcolor: "#374151", mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2563eb",
            }}
          >
            R
          </Avatar>

          <Box>

            <Typography fontWeight="bold">
              Rajesh Reddy
            </Typography>

            <Typography
              variant="body2"
              color="#9CA3AF"
            >
              Administrator
            </Typography>

          </Box>

        </Box>

        <ListItemButton
          sx={{
            mt: 3,
            borderRadius: 2,

            "&:hover": {
              bgcolor: "#1f2937",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />

        </ListItemButton>

      </Box>

    </Box>
  );
}

export default Sidebar;