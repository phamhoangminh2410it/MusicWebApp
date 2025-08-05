import axios from "axios";

// dotenv.config({ path: './.env' });

export default axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + '/api/v1/',
  withCredentials: true,
});