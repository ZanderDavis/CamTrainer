import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./create-account";
import "./profile";
import "../components/photos/favicon2.ico";
import { useNavigate } from "react-router-dom";
import usersService from "../services/users.service";
import Navbar from "../components/navbar/navbar";
import { Alert } from "@mui/material";

function LoginUser() {
  //Initalize Values
  const navigate = useNavigate();
  const [email, checkEmail] = React.useState("");
  const [password, checkPassword] = React.useState("");

  async function login() {
    // Check if email and password are valid
    if (email === "" || password === "") {
      alert("Please enter a valid email and password");
      return;
    }
    // Login
    try {
      const response = await usersService.findUser(email, password);
      if (response.data.success) {
        // Redirect to profile page
        localStorage.setItem("userId", response.data.user.id);
        navigate("/profile");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
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
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              sx={{
                border: 5,
                borderRadius: "16px",
                marginTop: 2,
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(e) => checkEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              sx={{
                border: 5,
                borderRadius: "16px",
                marginTop: 2,
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={(e) => checkPassword(e.target.value)}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
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
              onClick={login}
            >
              Sign In
            </Button>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Link href="create-account" variant="body2">
                  {"Haven't made an account yet? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default LoginUser;
