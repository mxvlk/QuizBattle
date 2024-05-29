import axios from "axios";
import { finishedGameUrl } from "../../config/ApiUrls";
import { OnlineUsers, UserAuth } from "../Interfaces";
import { Games } from "../Interfaces";

async function fetchFinishedGames(username: string, token: string) {
    return axios
        .post<Games[]>(finishedGameUrl, {username: username, token: token} as UserAuth)
        .then(res => res.data);
}

export {
    fetchFinishedGames
}