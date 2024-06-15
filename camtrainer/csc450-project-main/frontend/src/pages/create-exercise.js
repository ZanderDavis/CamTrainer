import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Checkbox, FormControlLabel } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import "./create-account";
import "../components/photos/favicon2.ico";
import "./profile";
import "./login";
import exercisesService from "../services/exercises.service";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

function CreateExercise() {
  //Initalize Values
  const [name, setName] = useState("");
  const [rules, setRules] = useState(""); // Initialize rules as null
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id === null) {
      navigate("/login");
    }
  }, []);

  //Handle file change
  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setRules(e.target.result);
    };
  };

  //Handle Boolean change for is hold
  const handleBoolean = (e) => {
    setChecked(e.target.checked);
  };

  const saveExercise = () => {
    //Create a model to be saved
    var data = {
      name: name,
      isHold: checked,
      rules: rules,
    };

    //Set values and push them into database
    exercisesService
      .create(data)
      .then((response) => {
        this.setState({
          name: response.data.name,
          isHold: response.data.checked,
          rules: response.data.rules,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          width: "100%", // Set width to 100%
        }}
      >
        <Avatar src="favicon2.ico" sx={{ width: 100, height: 100 }} />
        <Typography component="h1" variant="h5" mt={2}>
          Create Exercise
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mt: 2,
          }}
        >
          <TextField
            margin="normal"
            required
            name="name"
            label="Name"
            type="string"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            sx={{ width: 800, height: 100 }}
            mt={2}
          />
          <FormControlLabel
            control={
              <Checkbox
                margin="normal"
                required
                checked={checked}
                onChange={handleBoolean}
              />
            }
            mt={2}
            label="Is this exercise a hold?"
          />
          <Box sx={{ mt: 2 }}>
            <input type="file" onChange={handleChange} />
          </Box>
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
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "ffffff",
              textDecoration: "none",
            }}
            onClick={saveExercise}
          >
            Create Exercise
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default CreateExercise;
