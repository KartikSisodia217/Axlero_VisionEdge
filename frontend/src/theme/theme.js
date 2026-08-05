import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#10B981",
    },

    background: {
      default: "#F4F7FC",
      paper: "#FFFFFF",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {

    MuiCard: {

      styleOverrides: {

        root: {

          borderRadius: 18,

          boxShadow:
            "0 10px 35px rgba(0,0,0,.06)",

        },

      },

    },

    MuiButton: {

      styleOverrides: {

        root: {

          borderRadius: 12,

          padding: "10px 20px",

          fontWeight: 600,

        },

      },

    },

    MuiPaper: {

      styleOverrides: {

        root: {

          borderRadius: 18,

        },

      },

    },

  },

});

export default theme;