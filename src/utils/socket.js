import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    // For production - connect to your actual backend URL
    return io("https://dev-backend-7igo.onrender.com", {
      withCredentials: true  // Important for authentication
    });
  }
};

