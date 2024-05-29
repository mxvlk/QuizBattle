import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Question } from '../../util/interfaces';


export const v1QuestionRoute = express.Router();

// geth three quesitons by the given category id
v1QuestionRoute.post('/questions', async (req: Request, res: Response) => {
    const { category_id } = req.body;
    
    if (category_id) {
        let questionList = await prisma.question.findMany({
            where: {
                category_id: Number(category_id)
            }
        }) as Question[]

        if(questionList.length > 0){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(getRandomQuestions(questionList)));
        }
        else {
            res.status(404)
            res.send("Category not found");
        }
        
    }
    else {
        res.sendStatus(400);
    }
});

function getRandomQuestions(array: Question[]): Question[] {
    // Shuffle array
    const shuffled = array.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    return shuffled.slice(0, 3);
}

