import axios from "axios";
import {gameScoreUrl } from "../../config/ApiUrls";
import { Score, UserWithUUID } from "../Interfaces";

async function fetchScore(username: string, token: string, uuid: string) {
    return axios
        .post<Score>(gameScoreUrl, {username: username, token: token, uuid: uuid} as UserWithUUID)
        .then(res => res.data);
}

export {
    fetchScore
}