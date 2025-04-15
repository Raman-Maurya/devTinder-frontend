import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    return io("/", { path: "https://dev-backend-7igo.onrender.com/socket.io" },
             withCredentials:true);
  }
};

