interface User {
    username: string,
    token: string
}

interface Game {
    uuid: string,
    token: string,
    username: string
}

interface NewGame {
    user1: string,
    user2: string,
    secret: string
}

interface ReturnedGames {
    uuid: string,
    enemy: string,
    score: string
}[]

interface JwtPayload {
    username: string,
    iat: number,
    exp: number
}

interface Score {
    score: string
}

interface Category {
    id: number,
    name: string
}

type Categories = Category[];

interface categoryQuestions {
    id: number,
    currentQuestionsId: number,
    questionText: string,
    correctAnswer: string,
    falseAnswer1: string,
    falseAnswer2: string,
    falseAnswer3: string,
}

enum Task {
    Idle = 0,
    ChooseCategory = 1,
    PickAnswerSelf = 2,
    PickAnswerEnemy = 3,
    Finished = 4
}

export {
    User,
    Game,
    ReturnedGames,
    JwtPayload,
    Score,
    NewGame,
    Categories,
    categoryQuestions,
    Task
}