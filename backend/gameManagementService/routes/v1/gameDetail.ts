import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Game } from '../../util/interfaces';
import { gameDetailQuery } from '../../util/gameDetailQuery';
import { verifyJwt } from '../../util/jwt';

export const v1GameDetailRoute = express.Router();


// get details of a specific game (by sending uuid of the game)
v1GameDetailRoute.post('/gameDetail', async (req: Request, res: Response) => {

    const reqGame = req.body as Game;
    const { uuid , token , username } = reqGame;

    if(uuid && username && token){

        if(verifyJwt(token, username)) {
            const gameDetail = await gameDetailQuery(prisma, uuid);

            if(gameDetail) {
                res.status(200);
                res.send(gameDetail);
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