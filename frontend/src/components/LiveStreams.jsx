import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

const streams = [
  {
    name: "Camera-01",
    status: "Running",
  },
  {
    name: "Camera-02",
    status: "Running",
  },
  {
    name: "Camera-03",
    status: "Offline",
  },
  {
    name: "Camera-04",
    status: "Running",
  },
];

function LiveStreams() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Live Streams
        </Typography>

        <Stack spacing={2}>
          {streams.map((stream) => (
            <Stack
              key={stream.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{stream.name}</Typography>

              <Chip
                label={stream.status}
                color={
                  stream.status === "Running"
                    ? "success"
                    : "error"
                }
              />
            </Stack>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
}

export default LiveStreams;