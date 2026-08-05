import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

function HealthItem({ title, value, color }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography fontWeight="bold">
        {title}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          mt: 1,
          height: 10,
          borderRadius: 5,
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
          },
        }}
      />

      <Typography
        align="right"
        mt={1}
      >
        {value}%
      </Typography>
    </Box>
  );
}

function SystemHealth() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        mt: 3,
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          System Health
        </Typography>

        <HealthItem
          title="CPU Usage"
          value={42}
          color="#2563EB"
        />

        <HealthItem
          title="GPU Usage"
          value={71}
          color="#10B981"
        />

        <HealthItem
          title="RAM Usage"
          value={63}
          color="#F59E0B"
        />

        <HealthItem
          title="Disk Usage"
          value={38}
          color="#8B5CF6"
        />

      </CardContent>
    </Card>
  );
}

export default SystemHealth;