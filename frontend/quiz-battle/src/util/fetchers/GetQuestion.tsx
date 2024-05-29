import axios from "axios";
import { gameDetailUrl, getCategoriesUrl, getQuestionsUrl } from "../../config/ApiUrls";
import { Categories, GameDetail, ReturnQuestions, UserWithUUID } from "../Interfaces";

async function fetchQuestion(username: string, token: string, uuid: string) {
    return axios
        .post<ReturnQuestions>(getQuestionsUrl, {username: username, token: token, uuid: uuid} as UserWithUUID)
        .then(res => res.data);
}

export {
    fetchQuestion
}