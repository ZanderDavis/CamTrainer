import React, { useState } from "react";
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

function CreateAccount() {
  //Initalize Values for user
  const [weight, setWeight] = useState();
  const [feet, setFeet] = useState();
  const [inches, setInches] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rating, setRating] = useState("Beginner");
  const navigate = useNavigate();

  function saveUser() {
    //Set values to model
    var data = {
      weight: weight,
      feet: feet,
      inches: inches,
      username: username,
      email: email,
      password: password,
      rating: rating,
    };

    //Pass in and create user in database
    usersService
      .create(data)
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
    //navigate to login pages
    navigate("/login");
  }
  return (
    <div>
      <Navbar />
      <Container component="main" maxWidth="xs">
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
            Create Account
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="string"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
            <TextField
              margin="normal"
              required
              sx={{ width: "50%" }}
              name="feet"
              label="Height(FT)"
              type="number"
              onChange={(e) => setFeet(e.target.value)}
              autoComplete="feet"
            />
            <TextField
              margin="normal"
              required
              sx={{ width: "50%" }}
              name="inches"
              label="Height(IN)"
              type="number"
              onChange={(e) => setInches(e.target.value)}
              autoComplete="inches"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="weight"
              label="Weight(LB)"
              type="number"
              onChange={(e) => setWeight(e.target.value)}
              autoComplete="weight"
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
              onClick={saveUser}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default CreateAccount;
