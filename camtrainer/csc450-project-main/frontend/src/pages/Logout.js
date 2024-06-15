import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormGroup, MenuItem, InputLabel, Select, Input } from "@mui/material";
import "./create-account";
import "../components/photos/favicon2.ico";
import usersService from "../services/users.service";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import "./profile";
import "./login";
import "./home";
import Home from "./home";
import Profile from "./profile";
import Navbar from "../components/navbar/navbar";

function LogoutUser() {
  const id = localStorage.getItem("id");
  const navigate = useNavigate();

  function doNotLogout() {
    navigate("/profile");
  }

  function logout() {
    localStorage.clear();
    alert("Logout successful.");
    navigate("/home");
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
          Are you sure you want to logout?
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Button
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
              mr: 2,
            }}
            onClick={logout}
          >
            Yes
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              paddingLeft: 3,
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
            onClick={doNotLogout}
          >
            No
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default LogoutUser;
