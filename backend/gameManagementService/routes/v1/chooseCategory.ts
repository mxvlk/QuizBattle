import express, { Request, Response, response } from 'express';
import { prisma } from '../../util/prisma';
import { Game } from '../../util/interfaces';
import { gameDetailQuery } from '../../util/gameDetailQuery';
import { verifyJwt } from '../../util/jwt';
import { getQuestionsURL } from '../../util/config';
import { Task } from '../../util/interfaces';

export const v1chooseCategoryRoute = express.Router();

interface GameWithCategory extends Game {
    category: number
}

interface QuestionData {
    id: number,
    question_text: string,
    correct_answer: string,
    false_answer1: string,
    false_answer2: string,
    false_answer3: string,
    category_id: number
}

interface CategorieQuestion {
    id: number;
    currentQuestionsId: number;
    questionId: number;
    questionText: string;
    correctAnswer: string;
    falseAnswer1: string;
    falseAnswer2: string;
    falseAnswer3: string;
}

// choose a category to play
v1chooseCategoryRoute.post('/chooseCategory', async (req: Request, res: Response) => {

    const reqGame = req.body as GameWithCategory;
    const { uuid, token, username, category } = reqGame;

    if (uuid && username && token && category) {

        if (verifyJwt(token, username)) {
            const gameDetail = await gameDetailQuery(prisma, uuid);
            if (gameDetail?.currentPlayer === username && gameDetail?.task === Task.ChooseCategory) {
                try {
                    let questionData = await fetch(getQuestionsURL, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            category_id: category
                        }
                    )})
                    .then(response => response.json());

                    let questions = questionData as QuestionData[];

                    let getCurrentQuestions = await prisma.game.findUnique(
                        {
                            where: {
                                uuid: uuid
                            },
                            include: {
                                currentQuestion: {
                                    include: {
                                        categoryQuestions: true
                                    }
                                }
                            }
                        }
                    )

                    let updatesQuestion

                    if (getCurrentQuestions?.currentQuestion === null) {
                        updatesQuestion = await prisma.game.update(
                            {
                                where: {
                                    uuid: uuid
                                },
                                data: {
                                    task: Task.PickAnswerSelf,
                                    pickedCategory: category,
                                    questions: {
                                        create: {
                                            category: category,
                                            questionsId1: questions[0].id,
                                            questionsId2: questions[1].id,
                                            questionsId3: questions[2].id
                                        }
                                    },
                                    currentQuestion: {
                                        create: {
                                            category: category,
                                            categoryQuestions: {
                                                createMany: {
                                                    data: [
                                                        {
                                                            questionId: questions[0].id,
                                                            questionText: questions[0].question_text,
                                                            correctAnswer: questions[0].correct_answer,
                                                            falseAnswer1: questions[0].false_answer1,
                                                            falseAnswer2: questions[0].false_answer2,
                                                            falseAnswer3: questions[0].false_answer3
                                                        },
                                                        {
                                                            questionId: questions[1].id,
                                                            questionText: questions[1].question_text,
                                                            correctAnswer: questions[1].correct_answer,
                                                            falseAnswer1: questions[1].false_answer1,
                                                            falseAnswer2: questions[1].false_answer2,
                                                            falseAnswer3: questions[1].false_answer3
                                                        },
                                                        {
                                                            questionId: questions[2].id,
                                                            questionText: questions[2].question_text,
                                                            correctAnswer: questions[2].correct_answer,
                                                            falseAnswer1: questions[2].false_answer1,
                                                            falseAnswer2: questions[2].false_answer2,
                                                            falseAnswer3: questions[2].false_answer3
                                                        }
                                                    ]

                                                }
                                            }

                                        }
                                    }
                                }
                            });
                    }
                    else {
                        updatesQuestion = await prisma.game.update(
                            {
                                where: {
                                    uuid: uuid
                                },
                                data: {
                                    task: Task.PickAnswerSelf,
                                    pickedCategory: category,
                                    questions: {
                                        create: {
                                            category: category,
                                            questionsId1: questions[0].id,
                                            questionsId2: questions[1].id,
                                            questionsId3: questions[2].id
                                        }
                                    },
                                    currentQuestion: {
                                        update: {
                                            category: category,
                                            categoryQuestions: {
                                                updateMany: getCurrentQuestions?.currentQuestion?.categoryQuestions.map(
                                                    (categoryQuestion: CategorieQuestion, index: number) => ({
                                                        where: {
                                                            id: categoryQuestion.id,
                                                        },
                                                        data: {
                                                            questionId: questions[index].id,
                                                            questionText: questions[index].question_text,
                                                            correctAnswer: questions[index].correct_answer,
                                                            falseAnswer1: questions[index].false_answer1,
                                                            falseAnswer2: questions[index].false_answer2,
                                                            falseAnswer3: questions[index].false_answer3,
                                                        },
                                                    })
                                                ),
                                            },
                                        },
                                    },
                                }
                            });
                    }

                    res.status(200);
                    res.send(updatesQuestion);
                }
                catch (error) {
                    console.log(error);
                    res.status(404);
                    res.send('Game not found');
                }

            }
            else {
                res.status(400);
                res.send('Not your turn to pick a category');
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