import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { getScoreByUUID } from '../../util/score';
import { Game, Score } from '../../util/interfaces';
import { scoreQuery } from '../../util/scoreQuery';
import { verifyJwt } from '../../util/jwt';

export const v1ScoreRoute = express.Router();

// get the score of the game
v1ScoreRoute.post('/score', async (req: Request, res: Response) => {

    const reqGame = req.body as Game;
    const { uuid , token , username } = reqGame;

    if(uuid && token && username){

        if(verifyJwt(token, username)){
            const game = await scoreQuery(prisma, uuid);

            if(game) {
                const score = await getScoreByUUID(game.uuid);
                const returnedScore: Score = {score:  `${score.scoreUser1}:${score.scoreUser2}`};
                
                res.status(200);
                res.send(returnedScore);
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