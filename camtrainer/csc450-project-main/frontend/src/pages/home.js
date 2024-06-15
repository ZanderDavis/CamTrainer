import React, { useEffect } from "react";
import Navbar from "../components/navbar/navbar";
//import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  FormGroup,
  MenuItem,
  InputLabel,
  Select,
  Input,
  Divider,
} from "@mui/material";
import "./create-account";
import "./profile";
import "../components/photos/favicon2.ico";
import usersService from "../services/users.service";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { ThemeProvider, createTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";

//Theme Creation
const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
    },
    button: {
      primary: "#ff0000",
      secondary: "#46505A",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      dark: "#009688",
    },
  },
});

//const Home = () => {
//const navigate = useNavigate();
//<div>
//  return ( <Navbar />)
// </div>

//Function with redirects
function Home() {
  const navigate = useNavigate();

  function navMulti() {
    //if (user logined in){
    //navigate("/profile", { replace: true });
    //}
    //else{
    navigate("/login", { replace: true });
    //}
  }
  function navaccount() {
    navigate("/create-account", { replace: true });
  }

  return (
    <div>
      <Navbar />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar src="favicon2.ico" sx={{ width: 100, height: 100 }} />
        <Typography component="h1" variant="h5" mt={2}>
          Welcome to CamTrainer
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            width: 250,
            height: 100,
            backgroundColor: "#0b2a3b",
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "ffffff",
            textDecoration: "none",
          }}
          onClick={navMulti}
        >
          Login
        </Button>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            width: 250,
            height: 100,
            backgroundColor: "#0b2a3b",
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "ffffff",
            textDecoration: "none",
          }}
          onClick={navaccount}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
}

export default Home;
