import io from 'socket.io-client';
const CHAT_SERVER_URL =
    process.env.REACT_APP_CHAT_SERVER_URL || 'http://localhost:5000';
const socket = io.connect(CHAT_SERVER_URL);
export default socket;
