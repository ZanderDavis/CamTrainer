import http from "../http-common";

class WorkoutDataService {
  //Create function connection to backend
  create(data) {
    return http.post("/workouts", data);
  }

  //getAll function connection to backend
  getAll() {
    return http.get("/workouts");
  }
}

export default new WorkoutDataService();
