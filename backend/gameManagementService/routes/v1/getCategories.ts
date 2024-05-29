import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Game } from '../../util/interfaces';
import { gameDetailQuery } from '../../util/gameDetailQuery';
import { verifyJwt } from '../../util/jwt';

export const v1getCategoriesRoute = express.Router();


// get the current categories from which the user can choose one
v1getCategoriesRoute.post('/categories', async (req: Request, res: Response) => {

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
                        currentCategories: true,
                    }
                }
            );

            if(gameDetail){
                if(gameDetail.user1 === username || gameDetail.user2 === username){
                    res.status(200);
                    res.send({
                        gameDetail: gameDetail.currentCategories,
                        uuid: uuid
                    });
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