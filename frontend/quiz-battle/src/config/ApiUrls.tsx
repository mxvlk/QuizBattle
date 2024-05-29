const authServiceUrl = process.env.REACT_APP_AUTH_URL || "http://localhost:8080/api/v1";

const loginUrl = authServiceUrl + "/login";
const registerUrl = authServiceUrl + "/register";

const connectionSerivceUrl = process.env.REACT_APP_CONNECT_URL || "http://localhost:5001";

const pingUrl = connectionSerivceUrl + "/ping";
const onlineUsersUrl = connectionSerivceUrl + "/onlineUsers";
const requestsUrl = connectionSerivceUrl + "/requests";
const acceptRequestUrl = connectionSerivceUrl + "/acceptRequest";
const gameRequestUrl = connectionSerivceUrl + "/gameRequest";

const gameManagementServiceUrl = process.env.REACT_APP_GAME_MANAGEMENT_URL || "http://localhost:5000/api/v1";


const gameUrl = gameManagementServiceUrl + "/games";
const finishedGameUrl = gameManagementServiceUrl + "/finishedGames";
const gameDetailUrl = gameManagementServiceUrl + "/gameDetail";
const gameScoreUrl = gameManagementServiceUrl + "/score";
const getCategoriesUrl = gameManagementServiceUrl + "/categories";
const chooseCategoryUrl = gameManagementServiceUrl + "/chooseCategory";
const chooseAnswerUrl = gameManagementServiceUrl + "/pickAnswer";
const getQuestionsUrl = gameManagementServiceUrl + "/questions";



export {
    loginUrl,
    registerUrl,
    pingUrl,
    onlineUsersUrl,
    gameUrl,
    gameDetailUrl,
    gameScoreUrl,
    requestsUrl,
    acceptRequestUrl,
    gameRequestUrl,
    getCategoriesUrl,
    chooseCategoryUrl,
    chooseAnswerUrl,
    getQuestionsUrl,
    finishedGameUrl
}