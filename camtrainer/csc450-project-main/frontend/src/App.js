import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import LiveStream from "./pages/live-stream";
import CreateAccount from "./pages/create-account";
import Profile from "./pages/profile";
import Stats from "./pages/statistics";
import Userupdates from "./pages/userupdates";
import CreateExercise from "./pages/create-exercise";
import Logout from "./pages/Logout";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create-exercise" element={<CreateExercise />} />
          <Route path="/statistics" element={<Stats />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workout" element={<LiveStream />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userupdates" element={<Userupdates />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
