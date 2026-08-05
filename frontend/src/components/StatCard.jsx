import { Card, CardContent, Typography, Box } from "@mui/material";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 1,
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="bold">
            {title}
          </Typography>

          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              bgcolor: color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
            }}
          >
            {icon}
          </Box>

        </Box>

        <Typography
          variant="h3"
          mt={3}
          fontWeight="bold"
        >
          {value}
        </Typography>

        <Typography
          color="text.secondary"
          mt={2}
        >
          {subtitle}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default StatCard;