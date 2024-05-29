import axios from "axios";
import { onlineUsersUrl } from "../../config/ApiUrls";
import { OnlineUsers } from "../Interfaces";

async function fetchOnlineUsers() {
    return axios
        .get<OnlineUsers>(onlineUsersUrl)
        .then(res => res.data);
}

export {
    fetchOnlineUsers
}