import axios from "axios";

// const apiRequest = axios.create({
//   baseURL: "https://api.hotelmargarita.online",
//   withCredentials: true,
// });

const apiRequest = axios.create({
  baseURL: "http://localhost:3333",
  withCredentials: true,
});

export {
  apiRequest
};