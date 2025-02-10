import {io } from "socket.io-client";
import { sockeUrl } from "../3-Middleware/apiRequest";

// Configure the socket connection
const socket = io(`ws://${sockeUrl}`, {
    autoConnect: false, // Prevent auto-connection; connect explicitly when needed
  });

// const socket = io(`${sockeUrl}`, {
//   autoConnect: false, // Prevent auto-connection; connect explicitly when needed
// });
  
  export default socket;