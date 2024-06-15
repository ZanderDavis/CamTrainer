import React, { useState, useEffect } from "react";
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
import { useLocation } from "react-router-dom";
import "./login";
import "./Logout";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

function Profile() {
  //Initalize Values
  const [id, setID] = useState();
  const [weight, setWeight] = useState();
  const [feet, setFeet] = useState();
  const [inches, setInches] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rating, setRating] = useState();
  const navigate = useNavigate();

  //Delete User from database
  const DeleteUser = async () => {
    try {
      usersService.deleteUser(email);
      navigate("/login");
      console.log("after navigate");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  //Update User in Database
  function updatinguser() {
    navigate("/userupdates", { state: { email: email } });
  }

  //Get local data when page is created
  useEffect(() => {
    //Get data from localStorage
    async function fetchUserData(userId) {
      //get data information from backend
      usersService
        .getAll(userId)
        .then((response) => {
          setID(response.data.id);
          setWeight(response.data.weight);
          setFeet(response.data.feet);
          setInches(response.data.inches);
          setUsername(response.data.username);
          setEmail(response.data.email);
          setPassword(response.data.password);
          setRating(response.data.rating);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const userId = localStorage.getItem("userId");
    if (userId === null) {
      navigate("/login");
    } else {
      fetchUserData(userId);
    }
    console.log("tres", id);
  }, []);

  //const Profile = () => {
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
          Profile
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Divider
            component="h2"
            variant="h6"
            sx={{
              border: 5,
              borderRadius: "16px",
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Username: {username}
          </Divider>
          <Divider
            component="h2"
            variant="h5"
            sx={{
              border: 5,
              borderRadius: "16px",
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Email: {email}
          </Divider>
          <Box
            component="h2"
            variant="h6"
            sx={{
              border: 5,
              borderRadius: "16px",
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "right",
            }}
          >
            Height: {feet}'{inches}"
          </Box>
          <Divider
            component="h2"
            variant="h6"
            sx={{
              border: 5,
              borderRadius: "16px",
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Weight: {weight} lbs
          </Divider>
          <Divider
            component="h2"
            variant="h6"
            sx={{
              border: 5,
              borderRadius: "16px",
              marginTop: 2,
              marginBottom: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Experience: {rating}
          </Divider>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              mr: 2,
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
            onClick={updatinguser}
          >
            Update Profile
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              mr: 2,
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
            onClick={DeleteUser}
          >
            Delete Profile
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Profile;
