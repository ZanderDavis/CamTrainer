import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import usersService from "../services/users.service";
import exerciseService from "../services/exercises.service";
import workoutService from "../services/workouts.service";
import userHistoryService from "../services/userHistory.service";

// Exercise input row component
function ExerciseInputRow({
  onAdd,
  onEdit,
  onRemove,
  exerciseData = {
    name: "",
    isHold: false,
    sets: "",
    repsOrTime: "",
  },
  supportedExercises,
  alreadyAdded = false,
}) {
  const [name, setName] = useState(exerciseData.name);
  const [isHold, setIsHold] = useState(exerciseData.isHold);
  const [sets, setSets] = useState(exerciseData.sets);
  const [repsOrTime, setRepsOrTime] = useState(exerciseData.repsOrTime);
  const [beingEdited, setBeingEdited] = useState(false);

  const handleAdd = () => {
    onAdd({ name, isHold, sets, repsOrTime });
    if (!alreadyAdded) {
      setName("");
      setIsHold(false);
      setSets("");
      setRepsOrTime("");
    }
  };

  const handleSaveEdit = () => {
    setBeingEdited(false);
    onEdit({ name, isHold, sets, repsOrTime });
  };

  const handleChangeExercise = (e) => {
    setName(e.target.value);
    setIsHold(
      Object.values(supportedExercises).find((ex) => ex.name === e.target.value)
        .isHold
    );
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: "1px solid grey", borderRadius: "4px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Select
            fullWidth
            value={name}
            onChange={handleChangeExercise}
            displayEmpty
            disabled={alreadyAdded && !beingEdited}
          >
            <MenuItem value="">Select Exercise</MenuItem>
            {Object.entries(supportedExercises).map(([key, value]) => (
              <MenuItem key={key} value={value.name}>
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            label="Sets"
            disabled={alreadyAdded && !beingEdited}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="number"
            value={repsOrTime}
            onChange={(e) => setRepsOrTime(e.target.value)}
            label={isHold ? "Hold Time (s)" : "Reps"}
            disabled={alreadyAdded && !beingEdited}
          />
        </Grid>
        <Grid item xs={3}>
          {alreadyAdded ? (
            beingEdited ? (
              <Button
                sx={{
                  backgroundColor: "#0b2a3b",
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "ffffff",
                  textDecoration: "none",
                }}
                variant="contained"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            ) : (
              <>
                <Button
                  sx={{
                    mr: 2,
                    backgroundColor: "#0b2a3b",
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "ffffff",
                    textDecoration: "none",
                  }}
                  variant="contained"
                  onClick={() => setBeingEdited(true)}
                >
                  Edit
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#0b2a3b",
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "ffffff",
                    textDecoration: "none",
                  }}
                  variant="contained"
                  color="error"
                  onClick={onRemove}
                >
                  Remove
                </Button>
              </>
            )
          ) : (
            <Button
              sx={{
                py: 1,
                px: 3,
                backgroundColor: "#0b2a3b",
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "ffffff",
                textDecoration: "none",
              }}
              variant="contained"
              onClick={handleAdd}
            >
              Add Exercise
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

function LiveStream() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const shouldDetect = useRef(false);

  const [detector, setDetector] = useState(null);
  const [classifier, setClassifier] = useState(null);

  const [prediction, setPrediction] = useState({
    label: null,
    confidence: null,
  });

  const [supportedExercises, setSupportedExercises] = useState(null);

  const [allWorkouts, setAllWorkouts] = useState(null);

  const [loadedExercises, setLoadedExercises] = useState(false);

  // Workout format:
  // {
  //   id,
  //   name,
  //   restTime,
  //   exercises: [
  //   {
  //     id,
  //     exerciseId,
  //     name,
  //     isHold,
  //     sets,
  //     repsOrTime,
  //     classifier,
  //     rules,
  //   },
  //   ...
  //   ],
  // }
  const [workout, setWorkout] = useState({
    id: 0,
    name: null,
    restTime: 0,
    exercises: [],
  });
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [exercise, setExercise] = useState("");
  const [rules, setRules] = useState(null);

  const isInCooldown = useRef(false);
  const [exerciseStage, setExerciseStage] = useState(null);
  const previousStage = useRef(null);

  const [targetSets, setTargetSets] = useState(null);
  const [targetReps, setTargetReps] = useState(null);
  const [targetHoldTime, setTargetHoldTime] = useState(null);

  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [holdTime, setHoldTime] = useState(0);
  const holdTimerRef = useRef(null);

  const [needNextExercise, setNeedNextExercise] = useState(true);
  const [finishedWorkout, setFinishedWorkout] = useState(false);

  const [currentStep, setCurrentStep] = useState("select");

  const [elapsedTime, setElapsedTime] = useState(0);

  const [restTime, setRestTime] = useState(0);
  const [resting, setResting] = useState(false);

  const uid = useRef(0);

  const userId = useRef(null);
  const userWeight = useRef(null);
  const userExperience = useRef(null);

  const countdownAudioRef = useRef(null);
  const toneAudioRef = useRef(null);

  // Functions to change the current step
  const goToPerform = () => {
    // Set all exercise IDs to match their index in the workout
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((exercise, index) => ({
        ...exercise,
        id: index,
      })),
    });
    setCurrentStep("perform");
  };

  // Go to the review step
  const goToReview = () => {
    let totalCalories = 0;
    workout.exercises.forEach((exercise) => {
      const exerciseCalories =
        exercise.sets *
        exercise.repsOrTime *
        exercise.rules.calorieMultiplier *
        userWeight.current;
      totalCalories += exerciseCalories;
    });
    setWorkout({
      ...workout,
      caloriesBurned: totalCalories,
    });
    setCurrentStep("review");
  };

  // Reset to the select step
  const resetToSelect = () => {
    // Reset state variables
    setWorkout({
      id: 0,
      name: null,
      exercises: [],
    });
    setCurrentExerciseIdx(0);
    setExercise("");
    setRules(null);
    setExerciseStage(null);
    previousStage.current = null;
    setTargetSets(null);
    setTargetReps(null);
    setTargetHoldTime(null);
    setSets(0);
    setReps(0);
    setHoldTime(0);
    holdTimerRef.current = null;
    setNeedNextExercise(true);
    setFinishedWorkout(false);
    setPrediction({ label: null, confidence: null });
    setLoadedExercises(false);
    setElapsedTime(0);
    setRestTime(0);
    setResting(false);

    setCurrentStep("select");
  };

  // Function to add an exercise to the workout
  const addExercise = (exercise) => {
    setWorkout({
      ...workout,
      exercises: [
        ...workout.exercises,
        {
          id: uid.current++,
          exerciseId: Object.keys(supportedExercises).find(
            (key) => supportedExercises[key].name === exercise.name
          ),
          name: exercise.name,
          isHold: exercise.isHold,
          sets: exercise.sets,
          repsOrTime: exercise.repsOrTime,
          classifier: null,
          rules: null,
        },
      ],
    });
  };

  // Function to remove an exercise from the workout
  const removeExercise = (exerciseId) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    });
  };

  // Function to edit an exercise in the workout
  const editExercise = (exerciseId, newExercise) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...newExercise } : exercise
      ),
    });
  };

  // Format the workout data for saving
  const serializeWorkoutData = () => ({
    name: workout.name,
    exerciseIds: workout.exercises.map((ex) => ex.exerciseId),
    numOfSets: workout.exercises.map((ex) => ex.sets),
    secondsInbetweenSets: workout.restTime,
    numOfRepsOrTime: workout.exercises.map((ex) => ex.repsOrTime),
  });

  // Format the user history data for saving
  const serializeUserHistoryData = (workoutId) => ({
    userId: userId.current,
    workoutId: workoutId,
    dateOfWorkout: new Date().toLocaleDateString(),
    timeOfWorkout: elapsedTime,
  });

  // Save the workout and user history to the database
  const saveWorkout = async () => {
    setIsLoading(true);
    let workoutId = null;

    try {
      // Check if the workout is already saved
      const existingWorkout = allWorkouts.find((w) => w.name === workout.name);

      if (!existingWorkout) {
        // If not saved, serialize and save the new workout
        const workoutData = serializeWorkoutData();
        const response = await workoutService.create(workoutData);
        workoutId = response.data.id;
      } else {
        // If saved, use the existing ID
        workoutId = existingWorkout.id;
      }

      const userHistoryData = serializeUserHistoryData(workoutId);
      await userHistoryService.create(userHistoryData);

      setIsLoading(false);
      alert("Workout saved successfully.");
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to save workout or user history:", error);
      alert("Failed to save workout.");
    }

    resetToSelect();
  };

  // Draw detected keypoints on canvas
  const drawKeypoints = (keypoints) => {
    // Draw detected keypoints on canvas
    if (!keypoints) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial"; // Set the font size and type for the text
    ctx.fillStyle = "blue"; // Set the text color
    keypoints.forEach(({ x, y, score }, index) => {
      if (score > 0.5) {
        ctx.fillText(index.toString(), x, y); // Draw the index at the keypoint's position
      }
    });
  };

  const normalizeKeypoints = (keypoints) => {
    if (!keypoints) return;
    // Find min and max coordinates to form the bounding box
    let minX = Infinity,
      minY = Infinity,
      maxX = 0,
      maxY = 0;
    keypoints.forEach(({ x, y }) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });

    // Calculate the size of the bounding box
    const width = maxX - minX;
    const height = maxY - minY;

    // Normalize keypoints to a scale of 0 to 1
    return keypoints.map(({ x, y }) => ({
      x: (x - minX) / width,
      y: (y - minY) / height,
    }));
  };

  const calculateAngle = (pointA, pointB, pointC) => {
    let angle =
      Math.atan2(pointC.y - pointA.y, pointC.x - pointA.x) -
      Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
    angle = Math.abs((angle * 180) / Math.PI); // Convert to degrees and ensure it's positive
    if (angle > 180) angle = 360 - angle; // Adjust angles greater than 180 degrees
    return angle;
  };

  // Process the exercise (identify stage) based on the keypoints
  const processExercise = useCallback(
    (keypoints) => {
      if (!rules || keypoints.length === 0) {
        return;
      }

      let currentStage = null;

      Object.entries(rules.angleVertices).forEach(([keypointIndex, value]) => {
        const keypoint = keypoints[keypointIndex];
        const spousePoints = value.spouseIdx.map((index) => keypoints[index]);

        if (spousePoints.every((sp) => sp)) {
          const angle = calculateAngle(keypoint, ...spousePoints);
          value.angleRanges.forEach((range, stageIdx) => {
            if (angle >= range.min && angle <= range.max) {
              currentStage = rules.stages[stageIdx];
            }
          });
        }
      });

      if (!currentStage) return;

      if (rules.exerciseType === "Reps") {
        if (previousStage.current !== currentStage && !isInCooldown.current) {
          setExerciseStage(currentStage);
          if (
            previousStage.current === rules.stages[1] &&
            currentStage === rules.stages[0]
          ) {
            setReps((prevReps) => prevReps + 1);
            toneAudioRef.current.play();
          }
        }
        isInCooldown.current = true;
        setTimeout(() => (isInCooldown.current = false), 1000); // Cooldown period
      } else if (rules.exerciseType === "Hold") {
        setExerciseStage(currentStage);
        if (currentStage === "Correct") {
          if (!holdTimerRef.current) {
            holdTimerRef.current = setInterval(() => {
              setHoldTime((prevTime) => prevTime + 1);
            }, 1000);
          }
        } else {
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
        }
      }
    },
    [rules]
  );

  // Classify the pose based on the keypoints
  const classifyPose = useCallback(
    async (keypoints) => {
      if (!classifier || !keypoints) return { label: null, confidence: 0 };

      const keypointsArray = keypoints.map((kp) => [
        kp.x / webcamRef.current.video.videoWidth,
        kp.y / webcamRef.current.video.videoHeight,
      ]);

      const landmarksTensor = tf.tensor2d(keypointsArray, [17, 2]);

      const modelInput = landmarksTensor.flatten().reshape([1, 34]);

      const prediction = await classifier.predict(modelInput);
      const predArray = await prediction.data();
      const label = "exercise";
      const confidence = predArray[1];

      // Dispose of tensors
      landmarksTensor.dispose();
      modelInput.dispose();
      prediction.dispose();

      return { label, confidence };
    },
    [classifier]
  );

  const detectAndClassify = useCallback(async () => {
    if (
      !shouldDetect.current ||
      !webcamRef.current ||
      !detector ||
      !classifier ||
      currentStep !== "perform"
    ) {
      return;
    }

    const video = webcamRef.current.video;
    if (video && video.readyState === 4) {
      setIsLoading(false);

      const pose = await detector.estimatePoses(video);
      const absoluteKeypoints = pose[0]?.keypoints;

      drawKeypoints(absoluteKeypoints);

      const currentPrediction = await classifyPose(
        absoluteKeypoints,
        classifier
      );

      if (currentPrediction.confidence > 0.5) {
        setPrediction({
          label: exercise,
          confidence: currentPrediction.confidence,
        });

        const keypoints = normalizeKeypoints(absoluteKeypoints);
        processExercise(keypoints);
      } else {
        setPrediction({ label: null, confidence: 0 });
      }

      if (shouldDetect.current) {
        setTimeout(detectAndClassify, 1000 / 30); // 30 FPS
      }
    } else {
      if (shouldDetect.current) {
        setTimeout(detectAndClassify, 500); // Retry after a delay if video is not ready
      }
    }
  }, [
    webcamRef,
    detector,
    classifier,
    exercise,
    currentStep,
    processExercise,
    classifyPose,
  ]);

  // Setup TensorFlow and Pose Detection once
  useEffect(() => {
    async function initTensorFlow() {
      await tf.setBackend("webgl");
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
      );
      setDetector(detector);
    }

    if (currentStep === "perform" && !detector) {
      setIsLoading(true);
      initTensorFlow();
    }
  }, [detector, currentStep]);

  // Load classifier models for exercises in the workout
  useEffect(() => {
    async function loadExerciseData() {
      // Identify unique exercises by their name
      const uniqueExercises = new Map();
      workout.exercises.forEach((exercise) => {
        if (!uniqueExercises.has(exercise.name)) {
          uniqueExercises.set(exercise.name, exercise);
        }
      });

      // Load data for unique exercises
      const loadedData = await Promise.all(
        [...uniqueExercises.values()].map(async (exercise) => {
          const modelUrl = `http://localhost:8080/${exercise.name.toLowerCase()}/model.json`;
          const rulesUrl = `http://localhost:8080/${exercise.name.toLowerCase()}/${exercise.name.toLowerCase()}.json?version=${new Date().getTime()}`; // with cache busting

          try {
            const [classifier, rules] = await Promise.all([
              tf.loadLayersModel(modelUrl),
              fetch(rulesUrl).then((res) => res.json()),
            ]);
            return { name: exercise.name, classifier, rules };
          } catch (error) {
            console.error(
              "Failed to load data for exercise:",
              exercise.name,
              error
            );
            return { name: exercise.name, classifier: null, rules: null };
          }
        })
      );

      // Map loaded classifiers and rules to their exercise
      const dataMap = new Map(
        loadedData.map((item) => [
          item.name,
          { classifier: item.classifier, rules: item.rules },
        ])
      );

      // Alter rules to match userExperience, if applicable
      dataMap.forEach((data) => {
        // Applicable to rules.calorieMultiplier
        if (data.rules.calorieMultiplier[userExperience.current]) {
          data.rules.calorieMultiplier =
            data.rules.calorieMultiplier[userExperience.current];
        }
        // Applicable to angles
        for (const key in data.rules.angleVertices) {
          if (
            data.rules.angleVertices[key].angleRanges[userExperience.current]
          ) {
            data.rules.angleVertices[key].angleRanges =
              data.rules.angleVertices[key].angleRanges[userExperience.current];
          }
        }
      });

      // Apply data to all exercises in the workout
      setWorkout({
        ...workout,
        exercises: workout.exercises.map((exercise) => ({
          ...exercise,
          classifier: dataMap.get(exercise.name).classifier,
          rules: dataMap.get(exercise.name).rules,
        })),
      });

      setLoadedExercises(true);
    }

    if (currentStep === "perform" && !loadedExercises) {
      loadExerciseData();
    }
  }, [currentStep, workout, loadedExercises]);

  // Run detection and classification when webcam, detector, and classifier are ready
  useEffect(() => {
    if (
      webcamRef.current &&
      detector &&
      classifier &&
      currentStep === "perform"
    ) {
      shouldDetect.current = true;
      detectAndClassify();
    }

    return () => {
      shouldDetect.current = false;
    };
  }, [detector, classifier, currentStep, detectAndClassify]);

  // Update previousStage when exerciseStage changes
  useEffect(() => {
    if (exerciseStage) previousStage.current = exerciseStage;
  }, [exerciseStage]);

  // Setup next exercise when current exercise is finished
  useEffect(() => {
    async function setupNextExercise() {
      if (currentExerciseIdx < workout.exercises.length) {
        if (currentExerciseIdx !== 0) {
          // Rest for the specified time
          setRestTime(workout.restTime);
          setResting(true);
        }
        setSets(0);
        setReps(0);
        setHoldTime(0);

        const currentExercise = workout.exercises[currentExerciseIdx];
        setCurrentExerciseIdx(currentExercise.id);
        setExercise(currentExercise.name);
        setClassifier(null); // Clear previous classifier to kill detection loop
        setTimeout(() => setClassifier(currentExercise.classifier), 500); // Delay to avoid race condition
        setRules(currentExercise.rules);
        setTargetSets(Number(currentExercise.sets));
        currentExercise.isHold
          ? setTargetHoldTime(Number(currentExercise.repsOrTime))
          : setTargetReps(Number(currentExercise.repsOrTime));
        setNeedNextExercise(false);
      } else {
        setFinishedWorkout(true);
      }
    }

    if (currentStep === "perform" && loadedExercises && needNextExercise) {
      setupNextExercise();
    }
  }, [needNextExercise, loadedExercises, currentStep]);

  // Finish a set of reps
  useEffect(() => {
    if (!targetReps) return;
    if (reps === targetReps) {
      setReps(0);
      setSets((prevSets) => prevSets + 1);
    }
  }, [reps, targetReps]);

  // Finish a set of a hold
  useEffect(() => {
    if (!targetHoldTime) return;
    if (holdTime === targetHoldTime) {
      setHoldTime(0);
      setSets((prevSets) => prevSets + 1);
    }
  }, [holdTime, targetHoldTime]);

  // Finish an exercise
  useEffect(() => {
    if (!targetSets) return;
    if (sets === targetSets) {
      setCurrentExerciseIdx((prevIdx) => prevIdx + 1);
      setNeedNextExercise(true);
    }
  }, [sets, targetSets]);

  // Format time
  function formatLongTime(longTime) {
    const hours = Math.floor(longTime / 3600);
    const minutes = Math.floor((longTime % 3600) / 60);
    const seconds = longTime % 60;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }
  function formatShortTime(shortTime) {
    const minutes = Math.floor(shortTime / 60);
    const seconds = shortTime % 60;

    return `${padZero(minutes)}:${padZero(seconds)}`;
  }
  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  // Time the workout
  useEffect(() => {
    if (currentStep === "perform" && !isLoading && !finishedWorkout) {
      const timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, isLoading, finishedWorkout]);

  // Rest time
  useEffect(() => {
    if (resting) {
      const timer = setInterval(() => {
        setRestTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resting]);

  // React to rest time
  useEffect(() => {
    // If time is 0, stop resting and exercise
    if (resting && restTime === 0) {
      setResting(false);
    }
    // Play countdown when restTime is 3
    if (resting && restTime === 3) {
      countdownAudioRef.current.play();
    }
  }, [resting, restTime]);

  // Load user info, supported exercises, and workouts
  useEffect(() => {
    // Fetch user data
    async function fetchUserData(currUserId) {
      await usersService
        .getAll(currUserId)
        .then((response) => {
          userId.current = response.data.id;
          userWeight.current = response.data.weight;
          userExperience.current = response.data.rating;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // Fetch supported exercises
    async function fetchExercises() {
      try {
        const response = await exerciseService.getAll();
        const exercises = response.data.reduce((acc, exercise) => {
          acc[exercise.id] = {
            name: exercise.name,
            isHold: exercise.isHold,
          };
          return acc;
        }, {});
        setSupportedExercises(exercises);
        return exercises;
      } catch (error) {
        console.log("Failed to fetch exercises:", error);
      }
    }
    // Fetch workouts
    async function fetchWorkouts(exercises) {
      try {
        const response = await workoutService.getAll();
        const workouts = response.data.map((workout) => ({
          id: workout.id,
          name: workout.name,
          restTime: workout.secondsInbetweenSets,
          exercises: workout.exerciseIds.map((id, index) => ({
            id: uid.current++,
            exerciseId: id,
            name: exercises[id].name,
            isHold: exercises[id].isHold,
            sets: workout.numOfSets[index],
            repsOrTime: workout.numOfRepsOrTime[index],
          })),
        }));
        setAllWorkouts(workouts);
      } catch (error) {
        console.log("Failed to fetch workouts:", error);
      }
    }

    if (currentStep === "select") {
      const thisUserId = localStorage.getItem("userId");
      fetchUserData(thisUserId).then(() => {
        fetchExercises().then((exercises) => {
          fetchWorkouts(exercises);
        });
      });
    }
  }, [currentStep]);

  // Check if a user is logged in
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      navigate("/login");
    }
  }, []);

  // Navigate when workout is finished
  useEffect(() => {
    if (finishedWorkout) {
      goToReview();
      if (detector) detector.dispose();
      if (classifier) classifier.dispose();
      setDetector(null);
      setClassifier(null);
    }
  }, [finishedWorkout]);

  // During select phase, ensure workout name is cleared if all exercises are removed
  useEffect(() => {
    if (currentStep === "select") {
      if (workout.exercises.length === 0) {
        setWorkout({
          id: 0,
          name: null,
          restTime: 0,
          exercises: [],
        });
      }
    }
  }, [currentStep, workout]);

  //
  // stepper
  //
  const steps = [
    { label: "Select", key: "select" },
    { label: "Perform", key: "perform" },
    { label: "Review", key: "review" },
  ];

  const findStepIndex = (stepKey) => {
    return steps.findIndex((step) => step.key === stepKey);
  };

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
  }));

  function ColorlibStepIcon(props) {
    const icons = {
      select: <PlaylistAddCheckIcon />,
      perform: <FitnessCenterIcon />,
      review: <QueryStatsIcon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed: props.completed, active: props.active }}
      >
        {icons[props.icon]}
      </ColorlibStepIconRoot>
    );
  }

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

  //
  // end stepper
  //

  // UI components
  const selectUI = (
    <Box my={4}>
      {allWorkouts && (
        <>
          {allWorkouts.length !== 0 && (
            <Typography variant="h5" my={4}>
              Select a workout you've done before:
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            {allWorkouts.map((workout) => (
              <Paper
                key={workout.id}
                sx={{ p: 2, mb: 2, width: "25%", height: "fit-content" }}
              >
                <Typography variant="h6">{workout.name}</Typography>
                {workout.exercises.map((exercise) => (
                  <Typography key={exercise.id} variant="body1">
                    {exercise.name}: {exercise.sets} x {exercise.repsOrTime}{" "}
                    {exercise.isHold ? "seconds" : "reps"}
                  </Typography>
                ))}
                <Button
                  variant="contained"
                  onClick={() => {
                    setWorkout({
                      id: workout.id,
                      name: workout.name,
                      restTime: workout.restTime,
                      exercises: workout.exercises,
                    });
                  }}
                  sx={{
                    mt: 2,
                    backgroundColor: "#0b2a3b",
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "ffffff",
                    textDecoration: "none",
                  }}
                >
                  Select
                </Button>
              </Paper>
            ))}
          </Box>
        </>
      )}
      <Typography variant="h5" my={4}>
        Add an exercise to your workout:
      </Typography>
      {supportedExercises && (
        <>
          <ExerciseInputRow
            onAdd={addExercise}
            supportedExercises={supportedExercises}
          />
          {workout.exercises.length === 0 ? (
            <Typography variant="body1" my={4}>
              Your workout is empty.
            </Typography>
          ) : (
            <>
              <Typography variant="h5" my={4}>
                Current workout:
              </Typography>
              <Box
                fullWidth
                display={"flex"}
                justifyContent={"flex-start"}
                mb={4}
              >
                <TextField
                  type="text"
                  value={workout.name}
                  onChange={(e) =>
                    setWorkout({ ...workout, name: e.target.value })
                  }
                  helperText="Name your workout"
                  sx={{ width: "50%" }}
                />
                <Box width={"50%"} display={"flex"} justifyContent={"center"}>
                  <TextField
                    type="number"
                    value={workout.restTime}
                    onChange={(e) =>
                      setWorkout({ ...workout, restTime: e.target.value })
                    }
                    helperText="Rest time between sets (s)"
                    sx={{ width: "50%" }}
                  />
                </Box>
              </Box>
              {workout.exercises.map((exercise) => (
                <ExerciseInputRow
                  key={exercise.id}
                  exerciseData={{
                    name: exercise.name,
                    isHold: exercise.isHold,
                    sets: exercise.sets,
                    repsOrTime: exercise.repsOrTime,
                  }}
                  onEdit={(newExercise) =>
                    editExercise(exercise.id, newExercise)
                  }
                  onRemove={() => removeExercise(exercise.id)}
                  supportedExercises={supportedExercises}
                  alreadyAdded
                />
              ))}
            </>
          )}
        </>
      )}
      <Button
        variant="contained"
        onClick={goToPerform}
        disabled={workout.exercises.length === 0 || !workout.name}
        sx={{
          py: 1,
          px: 3,
          backgroundColor: "#0b2a3b",
          flexGrow: 1,
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "ffffff",
          textDecoration: "none",
        }}
      >
        Continue
      </Button>
    </Box>
  );

  const performUI = (
    <>
      <Typography variant="h2" my={4}>
        {formatLongTime(elapsedTime)}
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} md={6}>
          <Box
            my={4}
            mx={"auto"}
            width={640}
            height={480}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            position={"relative"}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box my={4}>
            {exercise && rules && (
              <>
                {workout.exercises.map((exercise, index) => (
                  <Accordion
                    key={index}
                    expanded={exercise.id === currentExerciseIdx}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h5">{exercise.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5">
                              Pose: {prediction?.label || "-"}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5">
                              Confidence:{" "}
                              {prediction?.confidence
                                ? prediction.confidence.toFixed(2)
                                : "-"}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              padding: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="h5">
                              {exercise.name}: {targetSets}{" "}
                              {targetSets === 1 ? "set" : "sets"} of{" "}
                              {rules.exerciseType === "Reps"
                                ? (targetReps || "-") + " reps"
                                : rules.exerciseType === "Hold"
                                ? formatShortTime(targetHoldTime) || "-"
                                : "-"}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={6}>
                          <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5">Sets: {sets}</Typography>
                          </Paper>
                        </Grid>
                        {rules.exerciseType === "Reps" && (
                          <Grid item xs={6}>
                            <Paper sx={{ padding: 2 }}>
                              <Typography variant="h5">Reps: {reps}</Typography>
                            </Paper>
                          </Grid>
                        )}
                        {rules.exerciseType === "Hold" && (
                          <Grid item xs={6}>
                            <Paper sx={{ padding: 2 }}>
                              <Typography variant="h5">
                                Time: {formatShortTime(holdTime)}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5">
                              Stage:{" "}
                              {rules &&
                              prediction?.label &&
                              prediction?.confidence
                                ? exerciseStage
                                : "-"}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h3" my={4}>
          {formatShortTime(restTime)}
        </Typography>
      )}
    </>
  );

  const reviewUI = (
    <Container>
      <Typography variant="h3" my={4}>
        Workout Complete
      </Typography>
      <Typography variant="h5" mb={2}>
        {workout.name}
      </Typography>
      {workout.exercises.map((exercise) => (
        <Typography key={exercise.id} variant="body1" mb={2}>
          {exercise.name}: {exercise.sets} x {exercise.repsOrTime}{" "}
          {exercise.isHold ? "seconds" : "reps"}
        </Typography>
      ))}
      <Typography variant="h5" mb={2}>
        Duration: {formatLongTime(elapsedTime)}
      </Typography>
      <Typography variant="h5" mb={2}>
        Calories Burned: {workout.caloriesBurned?.toFixed(0)}
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={saveWorkout}
          sx={{
            py: 1,
            px: 3,
            backgroundColor: "#0b2a3b",
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "ffffff",
            textDecoration: "none",
          }}
        >
          Save
        </Button>
      )}
    </Container>
  );

  // Render
  return (
    <div>
      <Navbar />
      <Container sx={{ padding: 8 }}>
        <Stack sx={{ width: "100%" }} spacing={4}>
          <Stepper
            activeStep={findStepIndex(currentStep)}
            alternativeLabel
            connector={<ColorlibConnector />}
          >
            {steps.map((step, index) => (
              <Step key={step.key}>
                <StepLabel
                  StepIconComponent={() =>
                    ColorlibStepIcon({
                      icon: step.key,
                      active: findStepIndex(currentStep) === index,
                      completed: findStepIndex(currentStep) > index,
                    })
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>

        {currentStep === "select" && selectUI}
        {currentStep === "perform" && performUI}
        {currentStep === "review" && reviewUI}
      </Container>
      <audio ref={countdownAudioRef}>
        <source src="sounds/countdown.mp3" type="audio/mpeg" />
        <p>Your browser does not support the audio element.</p>
      </audio>
      <audio ref={toneAudioRef}>
        <source src="sounds/tone.mp3" type="audio/mpeg" />
        <p>Your browser does not support the audio element.</p>
      </audio>
    </div>
  );
}

export default LiveStream;
