import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import {
  Grid,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Calendar from "../components/calendar";
import userHistoryService from "../services/userHistory.service";
import workoutsService from "../services/workouts.service";
import exercisesService from "../services/exercises.service";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const [userHistory, setUserHistory] = useState(null); // State variable to hold user history
  const [workoutData, setWorkoutData] = useState(null); // State variable to hold workout data
  const [exerciseData, setExerciseData] = useState(null); // State variable to hold exercise data

  useEffect(() => {
    async function GetWorkout(id) {
      try {
        const response = await userHistoryService.Past(id);
        setUserHistory(response.data); // Set user history data in state
      } catch (error) {
        console.log(error);
      }
    }
    const id = localStorage.getItem("userId");
    if (id === null) {
      navigate("/login");
    } else {
      GetWorkout(id);
    }
  }, []);

  useEffect(() => {
    async function getExerciseData() {
      try {
        const response = await exercisesService.getAll();
        setExerciseData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    async function getWorkoutData() {
      try {
        const response = await workoutsService.getAll();
        setWorkoutData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    if (userHistory !== null) {
      getExerciseData().then(() => getWorkoutData());
    }
  }, [userHistory]);

  return (
    <div>
      <Navbar />
      <div>
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", marginTop: "60px" }}
        >
          Workout History:
        </Typography>
        <Grid container spacing={15} justifyContent="center">
          <Grid item>
            <Box>{/* Calendar component */}</Box>
          </Grid>
        </Grid>
      </div>
      <TableContainer
        component={Paper}
        style={{
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          width: "70%",
          margin: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Workout</TableCell>
              <TableCell>Duration (s)</TableCell>
              <TableCell>Exercises</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userHistory &&
              userHistory.map((historyItem) => (
                <TableRow key={historyItem.id}>
                  <TableCell>
                    {historyItem.dateOfWorkout.slice(0, 10)}
                  </TableCell>
                  <TableCell>{historyItem.userId}</TableCell>
                  <TableCell>{historyItem.timeOfWorkout}</TableCell>
                  <TableCell>
                    {workoutData &&
                      exerciseData &&
                      workoutData
                        .filter(
                          (workout) => workout.id === historyItem.workoutId
                        )
                        .flatMap((workout) =>
                          workout.exerciseIds.map(
                            (exerciseId) =>
                              exerciseData.find(
                                (exercise) => exercise.id === Number(exerciseId)
                              )?.name
                          )
                        )
                        .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Landing;
