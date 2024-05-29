import axios from "axios";
import { requestsUrl } from "../../config/ApiUrls";
import { PlayRequest, UserAuth } from "../Interfaces";

async function fetchRequests(username: string, token: string) {
    return axios
        .post<PlayRequest[]>(requestsUrl, {username: username, token: token} as UserAuth)
        .then(res => res.data);
}

export {
    fetchRequests
}