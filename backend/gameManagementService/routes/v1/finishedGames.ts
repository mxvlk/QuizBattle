import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Score, getScoreByUUID } from '../../util/score';
import { User, ReturnedGames } from '../../util/interfaces';
import { verifyJwt } from '../../util/jwt';
import { userGamesQuery } from '../../util/findGamesQuery';

export const v1FinishedGamesRoute = express.Router();

// get all finished games for a user
v1FinishedGamesRoute.post('/finishedGames', async (req: Request, res: Response) => {

    const reqUser = req.body as User;
    const { username, token  } = reqUser;
    const finished = true;

    if(username && token){

        if(verifyJwt(token, username)){

            let { userGames1, userGames2 } = await userGamesQuery(prisma, username, finished);

            let userGames = userGames1.concat(userGames2);
            let sortedUserGames = userGames.sort((a,b) => a.id - b.id);
            let returnedGames: ReturnedGames[] = [];
    
            if(sortedUserGames.length > 0) {
    
                let promise = new Promise<void>((resolve, reject) => {
                    sortedUserGames.forEach(async (game, index) => {
                        let score = await getScoreByUUID(game.uuid) as Score;
        
                        returnedGames.push({
                            uuid: game.uuid, 
                            enemy: game.user1 === username ? game.user2 : game.user1, 
                            score: `${score.scoreUser1}:${score.scoreUser2}`
                        });
    
                        if(index === sortedUserGames.length-1){
                            resolve();
                        }
                    });
                });
    
                promise.then(() => {
                    res.status(200);
                    res.send(returnedGames);
                })
            }
            else {
                //no finished games
                res.send([]);
                res.status(200);
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