import axios from "axios";
import { gameUrl, onlineUsersUrl } from "../../config/ApiUrls";
import { OnlineUsers, UserAuth } from "../Interfaces";
import { Games } from "../Interfaces";

async function fetchActiveGames(username: string, token: string) {
    return axios
        .post<Games[]>(gameUrl, {username: username, token: token} as UserAuth)
        .then(res => res.data);
}

export {
    fetchActiveGames
}