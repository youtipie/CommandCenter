import {io} from 'socket.io-client';

export const SERVER_URL = 'http://192.168.0.163:5000';

export const socket = io(SERVER_URL, {
    autoConnect: false,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    timeout: 5000,
});