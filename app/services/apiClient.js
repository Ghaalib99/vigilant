import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://24.199.107.202",
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
