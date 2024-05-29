import axios from "axios";
import { pingUrl } from "../../config/ApiUrls";
import { OnlineUsers, UserAuth } from "../Interfaces";

async function pingServer(username: string, token: string) {
    return axios
        .post(pingUrl, {username: username, token: token} as UserAuth)
        .then(res => res.data);
}

export {
    pingServer
}