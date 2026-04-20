import axios from "axios";


const getBaseURL = () => {
  let url = process.env.REACT_APP_API_URL || "http://localhost:5000";
  

  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  
  return `${url}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;