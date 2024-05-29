import express, { Request, Response, response } from 'express';
import { prisma } from '../../util/prisma';
import { Game } from '../../util/interfaces';
import { verifyJwt } from '../../util/jwt';
import { getCategoriesURL } from '../../util/config';
import { gameDetailQuery } from '../../util/gameDetailQuery';
import { Task, Categories } from '../../util/interfaces';
import { Question } from '@prisma/client';

export const v1pickAnswerRoute = express.Router();

interface GameWithAnswer extends Game {
    question_id: number
    answer: string
}

interface CurrentGameInterface {
    currentQuestion: {
        categoryQuestions: {
            id: number,
            questionId: number,
            currentQuestionsId: number,
            questionText: string,
            correctAnswer: string,
            falseAnswer1: string,
            falseAnswer2: string,
            falseAnswer3: string
        }[]
    } | null
}

// route to choose an answer for a question
v1pickAnswerRoute.post('/pickAnswer', async (req: Request, res: Response) => {

    const reqGame = req.body as GameWithAnswer;
    const { uuid, token, username, answer, question_id } = reqGame;
    let setTask = 0;
    let setCurUser: string | null = "";
    let setFinished = false;
    let answerCorrect = false;

    if (uuid && username && token && answer && question_id) {

        if (verifyJwt(token, username)) {
            const currentGame = await prisma.game.findUnique({
                where: {
                    uuid: uuid
                },
                select: {
                    currentQuestion: {
                        select: {
                            categoryQuestions: true
                        }
                    }
                }
            });

            const gameDetail = await gameDetailQuery(prisma, uuid);
            if (gameDetail && currentGame && gameDetail.currentPlayer === username && (gameDetail.task === Task.PickAnswerSelf || gameDetail.task === Task.PickAnswerEnemy)) {
                const userNumber = gameDetail.user1 === username ? 1 : 2;
                let updatedAnswers = sortQuestionsById(gameDetail.questions);

                if (gameDetail.task === Task.PickAnswerSelf) {
                    const questionNumber = getQuestionNumberByValue(updatedAnswers[updatedAnswers.length - 1], question_id, userNumber);
                    let x = updateAnswer(updatedAnswers, questionNumber, currentGame, question_id, answer, userNumber);
                    updatedAnswers = x.updatedAnswerArray;
                    answerCorrect = x.answerCorrect;

                    let result = findQuestionsStatusByUser(updatedAnswers, userNumber);

                    if (result.incompletedCount === 0) {
                        setCurUser = userNumber === 1 ? gameDetail.user2 : gameDetail.user1;
                        setTask = Task.PickAnswerEnemy;
                    }
                    else {
                        setCurUser = userNumber === 1 ? gameDetail.user1 : gameDetail.user2;
                        setTask = Task.PickAnswerSelf;
                    }
                }
                else if (gameDetail.task === Task.PickAnswerEnemy) {
                    const questionNumber = getQuestionNumberByValue(updatedAnswers[updatedAnswers.length - 1], question_id, userNumber);
                    let x = updateAnswer(updatedAnswers, questionNumber, currentGame, question_id, answer, userNumber);
                    updatedAnswers = x.updatedAnswerArray;
                    answerCorrect = x.answerCorrect;


                    let result = findQuestionsStatusByUser(updatedAnswers, userNumber);

                    if (result.incompletedCount === 0 && updatedAnswers.length >= 6) {
                        setCurUser = null;
                        setFinished = true;
                        setTask = Task.Finished;
                    }
                    else if (result.incompletedCount === 0) {
                        setCurUser = userNumber === 1 ? gameDetail.user1 : gameDetail.user2;
                        setTask = Task.ChooseCategory;

                        let data = await fetch(getCategoriesURL).then(response => response.json());
                        let categories = data as Categories;
                        await updateCurrentCategoriesByUUID(uuid, categories);
                    }
                    else {
                        setCurUser = userNumber === 1 ? gameDetail.user1 : gameDetail.user2;
                        setTask = Task.PickAnswerEnemy;
                    }
                }

                await updateQuestionsInDB(uuid, updatedAnswers)

                try {
                    let updateGameState = await prisma.game.update(
                        {
                            where: {
                                uuid: uuid
                            },
                            data: {
                                task: setTask,
                                currentPlayer: setCurUser,
                                finished: setFinished
                            }
                        });
                }
                catch (error) {
                    console.log(error);
                }

                res.status(200);
                res.send({
                    answerCorrect: answerCorrect
                })

            }
            else {
                res.status(400);
                res.send('Not your turn to pick an answer');
            }
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(400);
    }

});

// returns the correct ansewer by the value of the question id
function getQuestionNumberByValue<T>(object: Record<string, T>, valueToFind: T, userNumber: Number): string {
    for (const key in object) {
        if (object.hasOwnProperty(key) && object[key] === valueToFind) {
            //return key;
            if (key === "questionsId1") {
                return userNumber === 1 ? "user1_answer1" : "user2_answer1";
            }
            else if (key === "questionsId2") {
                return userNumber === 1 ? "user1_answer2" : "user2_answer2";
            }
            else if (key === "questionsId3") {
                return userNumber === 1 ? "user1_answer3" : "user2_answer3";
            }
        }
    }
    return "undefined"; // Return undefined if the value is not found
}

// checks if the answer is correct, updates the answer array and returns it
function updateAnswer(updatedAnswerArray: Question[], questionKey: String, currentGame: CurrentGameInterface, userQuestionId: Number, userAnswer: String, userNumber: Number): { updatedAnswerArray: Question[], answerCorrect: boolean } {
    let answerCorrect = false;

    if (questionKey === "user1_answer1" || questionKey === "user2_answer1") {
        if (currentGame.currentQuestion?.categoryQuestions[0].questionId === userQuestionId && currentGame.currentQuestion?.categoryQuestions[0].correctAnswer === userAnswer) {
            answerCorrect = true;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer1" : "user2_answer1"] = answerCorrect;
        }
        else {
            answerCorrect = false;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer1" : "user2_answer1"] = answerCorrect;
        }
    }
    else if (questionKey === "user1_answer2" || questionKey === "user2_answer2") {
        if (currentGame.currentQuestion?.categoryQuestions[1].questionId === userQuestionId && currentGame.currentQuestion?.categoryQuestions[1].correctAnswer === userAnswer) {
            answerCorrect = true;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer2" : "user2_answer2"] = answerCorrect;
        }
        else {
            answerCorrect = false;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer2" : "user2_answer2"] = answerCorrect;
        }
    }
    else if (questionKey === "user1_answer3" || questionKey === "user2_answer3") {
        if (currentGame.currentQuestion?.categoryQuestions[2].questionId === userQuestionId && currentGame.currentQuestion?.categoryQuestions[2].correctAnswer === userAnswer) {
            answerCorrect = true;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer3" : "user2_answer3"] = answerCorrect;
        }
        else {
            answerCorrect = false;
            updatedAnswerArray[updatedAnswerArray.length - 1][userNumber === 1 ? "user1_answer3" : "user2_answer3"] = answerCorrect;
        }
    }

    return { updatedAnswerArray: updatedAnswerArray, answerCorrect: answerCorrect }
}

// checks if the user has completed all the three questions
function findQuestionsStatusByUser(
    questions: Question[],
    userNumber: number
): {
    completedCount: number;
    incompletedCount: number;
    incompletePositions: number[];
    incompletePositionsByUser: number[];
} {
    const completedByUser: number[] = [];
    const incompletedByUser: number[] = [];
    const incompletePositions: number[] = [];
    const incompletePositionsByUser: number[] = [];

    questions.forEach((question, index) => {
        const userAnswer1 = userNumber === 1 ? question.user1_answer1 : question.user2_answer1;
        const userAnswer2 = userNumber === 1 ? question.user1_answer2 : question.user2_answer2;
        const userAnswer3 = userNumber === 1 ? question.user1_answer3 : question.user2_answer3;

        const isComplete =
            userAnswer1 !== (undefined || null) &&
            userAnswer2 !== (undefined || null) &&
            userAnswer3 !== (undefined || null);

        if (isComplete) {
            completedByUser.push(index);
        } else {
            incompletedByUser.push(index);
            incompletePositions.push(index);
            incompletePositionsByUser.push(index);
        }
    });

    return {
        completedCount: completedByUser.length,
        incompletedCount: incompletedByUser.length,
        incompletePositions,
        incompletePositionsByUser,
    };
}

// takes the updated answers and saves them in the db
async function updateQuestionsInDB(gameUuid: string, updatedAnswers: Question[]) {
    try {
        const game = await prisma.game.findUnique({
            where: {
                uuid: gameUuid,
            },
            include: {
                questions: true,
            },
        });

        if (!game) {
            console.log("no game found!");
        }
        else {
            const updatedQuestionsWithIds = updatedAnswers.map((updatedQuestion) => ({
                ...updatedQuestion,
                gameId: game.id,
            }));

            // Use Prisma transaction to update questions atomically
            await prisma.$transaction([
                prisma.question.deleteMany({
                    where: {
                        gameId: game.id,
                    },
                }),
                prisma.question.createMany({
                    data: updatedQuestionsWithIds,
                }),
            ]);
        }
    } catch (error) {
        console.error(`Error updating questions: ${error}`);
    }
}

async function updateCurrentCategoriesByUUID(gameUUID: string, newCategories: Categories): Promise<void> {
    try {
        const game = await prisma.game.findUnique({
            where: {
                uuid: gameUUID,
            },
            include: {
                currentCategories: true,
            },
        });

        if (!game) {
            throw new Error('Game not found');
        }

        const dataToUpdate = {
            category1: newCategories[0]?.name,
            category2: newCategories[1]?.name,
            category3: newCategories[2]?.name,
            category1_id: newCategories[0]?.id,
            category2_id: newCategories[1]?.id,
            category3_id: newCategories[2]?.id,
        };

        await prisma.currentCategories.update({
            where: {
                gameId: game.id,
            },
            data: dataToUpdate,
        });

        console.log('CurrentCategories updated successfully');
    } catch (error) {
        console.error(`Error updating currentCategories: ${error}`);
    }
}

function sortQuestionsById(questions: Question[]): Question[] {
    return questions.slice().sort((a, b) => a.id - b.id);
}
