const getCategoriesURL = process.env.GET_CATEGORIES_URL || 'http://127.0.0.1:8081/api/v1/category';
const getQuestionsURL = process.env.GET_QUESTIONS_URL || 'http://127.0.0.1:8081/api/v1/questions';
const createGameSecretKey = process.env.CREATE_NEW_GAME_SECRET || "createGameSecret";

export {
    getCategoriesURL,
    getQuestionsURL,
    createGameSecretKey
}