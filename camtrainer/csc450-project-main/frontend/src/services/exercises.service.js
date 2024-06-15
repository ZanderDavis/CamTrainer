import http from "../http-common";

class ExerciseDataService {
    //Create function connection to backend
    create(data) {
        return http.post("/exercises", data);
      }
      //getByID function connection to backend
      getById(id){
        return http.get(`/exercises/${id}`)
      }

      //getAll function connection to backend
      getAll(){
        return http.get("/exercises")
      }
}

export default new ExerciseDataService();