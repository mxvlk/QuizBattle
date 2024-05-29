import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Game } from '../../util/interfaces';
import { verifyJwt } from '../../util/jwt';
import { categoryQuestion } from '@prisma/client';

export const v1getQuestionsRoute = express.Router();


interface ReturnQuestion {
    question_id:  number,
    question_text: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string
}

// get the current questions to answer
v1getQuestionsRoute.post('/questions', async (req: Request, res: Response) => {

    const reqGame = req.body as Game;
    const { uuid , token , username } = reqGame;

    if(verifyJwt(token, username)) {
        
        if(token && username) {
            const gameDetail = await prisma.game.findUnique(
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
            );

            if(gameDetail){
                if(gameDetail.user1 === username || gameDetail.user2 === username){
                    res.status(200);
                    res.send(generateReturnQuestion(gameDetail.currentQuestion?.categoryQuestions));
                }
                else {
                    res.sendStatus(400);
                }
            }
            else {
                res.status(404);
                res.send('Game not found');
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

// return questions randomised and as answer1, answer2, ... so the user doesnt know the correct answer
function generateReturnQuestion(categoryQuestions: categoryQuestion[] | undefined): ReturnQuestion[] {
    let returnQuestionArray = [] as ReturnQuestion[]

    if (categoryQuestions){
        for (let i = 0; i < 3; i++){
            let answers = []
            answers.push(categoryQuestions[i].correctAnswer)
            answers.push(categoryQuestions[i].falseAnswer1)
            answers.push(categoryQuestions[i].falseAnswer2)
            answers.push(categoryQuestions[i].falseAnswer3)
    
            const shuffeledAnswers = shuffleArray(answers)
    
            const question = {
                question_id: categoryQuestions[i].questionId,
                question_text: categoryQuestions[i].questionText,
                answer1: shuffeledAnswers[0],
                answer2: shuffeledAnswers[1],
                answer3: shuffeledAnswers[2],
                answer4: shuffeledAnswers[3]
            } 
    
            returnQuestionArray.push(question)
        }
    }

    return returnQuestionArray
}

// shuffle any array random
function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      
      const randomIndex = Math.floor(Math.random() * (i + 1));
  
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
  
    return shuffledArray;
  }
