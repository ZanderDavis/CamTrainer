import http from "../http-common";

class UserHistoryDataService {
  //Create function connection to backend
    create(data) {
        return http.post("/userHistory", data);
      }

  Past(userId) {
      console.log("in service");
        return http.get(`/userHistory/${userId}`);
      }
}

export default new UserHistoryDataService();
