import { useState } from "react";

import {
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
} from "@mui/material";

const logData = [
  {
    id: 1,
    time: "10:20 AM",
    module: "Authentication",
    status: "Success",
    message: "Admin logged in",
  },
  {
    id: 2,
    time: "10:32 AM",
    module: "User API",
    status: "Success",
    message: "New user created",
  },
  {
    id: 3,
    time: "10:48 AM",
    module: "Stream API",
    status: "Warning",
    message: "Camera temporarily disconnected",
  },
  {
    id: 4,
    time: "11:02 AM",
    module: "Database",
    status: "Error",
    message: "Connection timeout",
  },
  {
    id: 5,
    time: "11:15 AM",
    module: "Dashboard",
    status: "Success",
    message: "Dashboard loaded",
  },
];

function Logs() {
  const [search, setSearch] = useState("");

  const filteredLogs = logData.filter((log) =>
    log.module.toLowerCase().includes(search.toLowerCase()) ||
    log.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        System Logs
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          label="Search Logs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>

          <TableHead>

            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Time</b></TableCell>
              <TableCell><b>Module</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Message</b></TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {filteredLogs.map((log) => (

              <TableRow key={log.id} hover>

                <TableCell>{log.id}</TableCell>

                <TableCell>{log.time}</TableCell>

                <TableCell>{log.module}</TableCell>

                <TableCell>

                  <Chip
                    label={log.status}
                    color={
                      log.status === "Success"
                        ? "success"
                        : log.status === "Warning"
                        ? "warning"
                        : "error"
                    }
                  />

                </TableCell>

                <TableCell>{log.message}</TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>
      </Paper>

      <Stack
        direction="row"
        justifyContent="space-between"
        mt={2}
      >
        <Typography color="gray">
          Total Logs: {filteredLogs.length}
        </Typography>

        <Typography color="gray">
          VisionEdge Monitoring System
        </Typography>
      </Stack>
    </>
  );
}

export default Logs;