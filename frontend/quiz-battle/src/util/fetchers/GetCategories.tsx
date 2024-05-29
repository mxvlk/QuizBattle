import axios from "axios";
import { gameDetailUrl, getCategoriesUrl } from "../../config/ApiUrls";
import { Categories, GameDetail, UserWithUUID } from "../Interfaces";

async function fetchCategories(username: string, token: string, uuid: string) {
    return axios
        .post<Categories>(getCategoriesUrl, {username: username, token: token, uuid: uuid} as UserWithUUID)
        .then(res => res.data);
}

export {
    fetchCategories
}