export const socket = io("/", {
    withCredentials: true, 
    transports: ["websocket"],
    autoConnect: false
});
