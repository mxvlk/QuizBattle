import express, { Request, Response } from 'express';
import { prisma } from './prisma';

interface Score {
    scoreUser1: number,
    scoreUser2: number
}

// function that calculates the score of a game with given uuid
async function getScoreByUUID(uuid: string): Promise<Score> {

        const game = await prisma.game.findUnique(
            {
                where: {
                    uuid: uuid
                },
                include: {
                    questions: true
                }
            }
        );

        if(game) {

            let scoreUser1 = 0;
            let scoreUser2 = 0;

            game.questions.forEach((question) => {
                // (no clean code)
                if(question.user1_answer1) {
                    scoreUser1++;
                }
                if(question.user1_answer2) {
                    scoreUser1++;
                }
                if(question.user1_answer3) {
                    scoreUser1++;
                }

                if(question.user2_answer1) {
                    scoreUser2++;
                }
                if(question.user2_answer2) {
                    scoreUser2++;
                }
                if(question.user2_answer3) {
                    scoreUser2++;
                }
            });

            return {scoreUser1: scoreUser1, scoreUser2: scoreUser2};
        }
        else {
            return {scoreUser1: -1, scoreUser2: -1};
        }
}

export {
    getScoreByUUID,
    Score
}
