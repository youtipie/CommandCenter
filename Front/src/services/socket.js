import {io} from 'socket.io-client';

export const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const socket = io(SERVER_URL, {
    autoConnect: false,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    timeout: 5000,
});