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
import Navbar from "../components/navbar/navbar";

function UpdateUsers() {
  //Initalize Values
  const [id, setID] = useState();
  const [weight, setWeight] = useState();
  const [feet, setFeet] = useState();
  const [inches, setInches] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rating, setRating] = useState("");
  const navigate = useNavigate();

  //Get user data from local storage
  const userId = localStorage.getItem("userId");
  async function fetchUserData() {
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
  //Save user to database
  function saveUser() {
    var data = {
      id: id,
      weight: weight,
      feet: feet,
      inches: inches,
      username: username,
      email: email,
      password: password,
      rating: rating,
    };

    usersService
      .Userupdate(id, data)
      .then((response) => {
        setWeight(response.data.weight);
        setFeet(response.data.feet);
        setInches(response.data.inches);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPassword(response.data.password);
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    navigate("/profile");
  }
  useEffect(() => {
    fetchUserData();
  }, []);
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
      ></Box>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar src="favicon2.ico" sx={{ width: 100, height: 100 }} />
          <Typography component="h1" variant="h5" mt={2}>
            Update Profile
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              type="string"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              sx={{ width: "50%" }}
              name="feet"
              type="number"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              sx={{ width: "50%" }}
              name="inches"
              type="number"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <FormGroup>
              <InputLabel id="experience-select">Experience Level</InputLabel>
              <Select
                labelId="experience-select"
                id="experience-selector"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <MenuItem value={"Beginner"}>Beginner</MenuItem>
                <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"Expert"}>Expert</MenuItem>
              </Select>
            </FormGroup>
            <Button
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
              onClick={saveUser}
            >
              Update Profile
            </Button>

            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Link href="profile" variant="body2">
                  {"Show profile"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default UpdateUsers;
