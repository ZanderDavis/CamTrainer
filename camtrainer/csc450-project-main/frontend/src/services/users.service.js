import http from "../http-common";

class UsersDataService {
  //GetAll function connection to backend
  getAll(id) {
    return http.get(`/users/${id}`);
  }

  //updates a users information
  Userupdate(id, data) {
    return http.put(`/users/${id}`, data);
  }

  //Create function connection to backend
  create(data) {
    return http.post("/users", data);
  }

  //deletes the user
  deleteUser(email) {
    return http.delete(`/users/${email}`);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }

  findByUsername(username) {
    return http.get(`/users?username=${username}`);
  }

  findByPassword(password) {
    return http.get(`/users?password=${password}`);
  }

  findByEmail(email) {
    return http.get(`/?email=${email}`);
  }

  //email
  findUser(email, password) {
    console.log(email);
    return http.get(`/users/${email}/${password}`);
  }

  findByFeet(feet) {
    return http.get(`/users?feet=${feet}`);
  }
  findByInches(inches) {
    return http.get(`/users?inches=${inches}`);
  }
  findByLB(LB) {
    return http.get(`/users?lb=${LB}`);
  }
  findByExperience(experience) {
    return http.get(`/users?experience=${experience}`);
  }
}

export default new UsersDataService();
