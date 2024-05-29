import { NumberInputStylesNames } from "@mantine/core"

interface GameDetail {
    score?: string,
    id: string,
    uuid: string,
    user1: string,
    user2: string,
    currentPlayer: string,
    task: number,
    questions: (Question)[]
}

enum CategoryName {
    Bücher_und_Wörter = 1,
    Comics = 2,
    Computerspiele = 3,
    Die_2000er = 4,
    Draussen_im_Grünen = 5,
    Essen_und_Trinken = 6,
    Glaube_und_Religion = 7,
    Im_Labor = 8,
    Kinofilme = 9,
    Körper_und_Geist = 10
}

interface Categories {
    gameDetail: {
        category1: string,
        category1_id: number,
        category2: string,
        category2_id: number,
        category3: string,
        category3_id: number
    },
    uuid: string
}

enum Task {
    Idle = 0,
    ChooseCategory = 1,
    PickAnswerSelf = 2,
    PickAnswerEnemy = 3,
    Finished = 4
}

interface ReturnQuestion {
    question_id:  number,
    question_text: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string
}

type ReturnQuestions = ReturnQuestion[];


interface Question {
    id: number,
    gameId: number,
    category: number,
    user1_answer1?: boolean,
    user1_answer2?: boolean,
    user1_answer3?: boolean,
    user2_answer1?: boolean,
    user2_answer2?: boolean,
    user2_answer3?: boolean
}

interface Score {
    score: string
}

interface User {
    username: string,
    lastPing: number
}

interface OnlineUsers{
    onlineUsers: (User)[]
}

interface Games {
    enemy: string,
    score: string,
    uuid: string
}

interface UserAuth {
    username: string,
    token: string
}

interface UserWithUUID {
    username: string,
    token: string,
    uuid: string
}

interface UserWithCategory extends UserWithUUID {
    category: number
}

interface UserWithAnswer extends UserWithUUID {
    question_id: number,
    answer: string
}

interface PlayRequest {
    user: string,
    enemy: string,
    time: number,
    accepted: boolean,
    gameCreated: boolean
}

export type {
    GameDetail,
    Question,
    Score,
    OnlineUsers,
    Games,
    UserAuth,
    UserWithUUID,
    PlayRequest,
    Categories,
    UserWithCategory,
    UserWithAnswer,
    ReturnQuestions
}

export {
    Task,
    CategoryName
}