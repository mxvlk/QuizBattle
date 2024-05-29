import axios from "axios";
import { gameDetailUrl } from "../../config/ApiUrls";
import { GameDetail, UserWithUUID } from "../Interfaces";

async function fetchGameState(username: string, token: string, uuid: string) {
    return axios
        .post<GameDetail>(gameDetailUrl, {username: username, token: token, uuid: uuid} as UserWithUUID)
        .then(res => res.data);
}

export {
    fetchGameState
}