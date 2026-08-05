import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  createStream,
  deleteStream,
  getStreams,
  updateStream,
} from "../services/streamService";

function StreamManagement() {

  const [streams, setStreams] = useState([]);

  const [filteredStreams, setFilteredStreams] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editingStream, setEditingStream] = useState(null);

  const [formData, setFormData] = useState({

    name: "",

    rtsp_url: "",

    status: "Running",

  });

  const [snackbar, setSnackbar] = useState({

    open: false,

    severity: "success",

    message: "",

  });

  useEffect(() => {

    loadStreams();

  }, []);

  useEffect(() => {

    filterStreams();

  }, [streams, search]);

  async function loadStreams() {

    setLoading(true);

    try {

      const data = await getStreams();

      setStreams(data);

      setFilteredStreams(data);

    }

    catch (error) {

      console.error(error);

    }

    setLoading(false);

  }

  function filterStreams() {

    if (search.trim() === "") {

      setFilteredStreams(streams);

      return;

    }

    const result = streams.filter((stream) =>

      stream.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      stream.rtsp_url
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFilteredStreams(result);

  }

  function handleOpenCreate() {

    setEditingStream(null);

    setFormData({

      name: "",

      rtsp_url: "",

      status: "Running",

    });

    setOpen(true);

  }

  function handleEdit(stream) {

    setEditingStream(stream);

    setFormData({

      name: stream.name,

      rtsp_url: stream.rtsp_url,

      status: stream.status,

    });

    setOpen(true);

  }

  function handleClose() {

    setOpen(false);

  }

  async function handleSave() {

    try {

      if (editingStream) {

        await updateStream(
          editingStream.id,
          formData
        );

        setSnackbar({

          open: true,

          severity: "success",

          message: "Stream Updated",

        });

      }

      else {

        await createStream(formData);

        setSnackbar({

          open: true,

          severity: "success",

          message: "Stream Created",

        });

      }

      loadStreams();

      handleClose();

    }

    catch (error) {

      console.error(error);

      setSnackbar({

        open: true,

        severity: "error",

        message: "Operation Failed",

      });

    }

  }

  async function handleDelete(id) {

    if (!window.confirm("Delete this stream?")) {

      return;

    }

    try {

      await deleteStream(id);

      loadStreams();

      setSnackbar({

        open: true,

        severity: "success",

        message: "Stream Deleted",

      });

    }

    catch (error) {

      console.error(error);

    }

  }

  function handleSnackbarClose() {

    setSnackbar({

      ...snackbar,

      open: false,

    });

  }

  return (

    <>

      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 4,
    flexWrap: "wrap",
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
      Stream Management
    </Typography>

    <Typography
      sx={{
        color: "#6B7280",
        mt: 0.5,
      }}
    >
      Manage RTSP video streams
    </Typography>
  </Box>

  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={handleOpenCreate}
    sx={{
      px: 3.5,
      py: 1.2,
      borderRadius: "14px",
      textTransform: "none",
      fontWeight: 600,
      background:
        "linear-gradient(90deg,#2563EB,#3B82F6)",

      "&:hover": {
        background:
          "linear-gradient(90deg,#1D4ED8,#2563EB)",
        transform: "translateY(-2px)",
      },
    }}
  >
    Add Stream
  </Button>
</Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >

        <TextField
          fullWidth
          placeholder="Search Stream..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >

        <DialogTitle>

          {editingStream
            ? "Edit Stream"
            : "Create Stream"}

        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="Stream Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="RTSP URL"
            value={formData.rtsp_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                rtsp_url: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            {editingStream
              ? "Update"
              : "Create"}
          </Button>

        </DialogActions>

      </Dialog>
            <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <b>ID</b>
                </TableCell>

                <TableCell>
                  <b>Stream Name</b>
                </TableCell>

                <TableCell>
                  <b>RTSP URL</b>
                </TableCell>

                <TableCell>
                  <b>Status</b>
                </TableCell>

                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    Loading...
                  </TableCell>

                </TableRow>

              ) : (

                filteredStreams.map((stream) => (

                  <TableRow
                    key={stream.id}
                    hover
                  >

                    <TableCell>
                      {stream.id}
                    </TableCell>

                    <TableCell>
                      {stream.name}
                    </TableCell>

                    <TableCell>
                      {stream.rtsp_url}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={stream.status}
                        color={
                          stream.status === "Running"
                            ? "success"
                            : stream.status === "Stopped"
                            ? "warning"
                            : "error"
                        }
                      />

                    </TableCell>

                    <TableCell align="center">

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleEdit(stream)
                        }
                        sx={{
                          mr: 1,
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() =>
                          handleDelete(stream.id)
                        }
                      >
                        Delete
                      </Button>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >

        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

    </>

  );

}

export default StreamManagement;