import {
  Grid,
  Box,
  Typography,
  Chip,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";
import PeopleIcon from "@mui/icons-material/People";
import VideocamIcon from "@mui/icons-material/Videocam";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";

import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import LiveStreams from "../components/LiveStreams";
import RecentUsers from "../components/RecentUsers";
import SystemHealth from "../components/SystemHealth";

function Dashboard() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            VisionEdge Dashboard
          </Typography>

          <Typography
            sx={{
              color: "#6B7280",
              mt: 0.5,
            }}
          >
            Real-time Video Analytics Monitoring System
          </Typography>
        </Box>

        <Chip
          icon={
            <CircleIcon
              sx={{
                color: "#22C55E !important",
                fontSize: 12,
              }}
            />
          }
          label="System Online"
          sx={{
            bgcolor: "#ECFDF5",
            color: "#166534",
            fontWeight: 700,
            borderRadius: "12px",
            px: 1,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Users"
            value={100}
            subtitle="10 Active Users"
            icon={<PeopleIcon />}
            color="#2563EB"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Streams"
            value={20}
            subtitle="5 Running"
            icon={<VideocamIcon />}
            color="#10B981"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="GPU Usage"
            value={72}
            subtitle="Realtime Processing"
            icon={<MemoryIcon />}
            color="#F59E0B"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Database"
            value={1}
            subtitle="Online"
            icon={<StorageIcon />}
            color="#8B5CF6"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsChart />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SystemHealth />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <LiveStreams />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <RecentUsers />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;