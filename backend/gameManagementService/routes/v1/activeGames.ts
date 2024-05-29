import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Score, getScoreByUUID } from '../../util/score';
import { User, ReturnedGames } from '../../util/interfaces';
import { verifyJwt } from '../../util/jwt';
import { userGamesQuery } from '../../util/findGamesQuery';

export const v1GamesRoute = express.Router();

interface userGame {
    id: number;
    uuid: string;
    user1: string;
    user2: string;
    finished: boolean;
    currentPlayer: string | null;
    task: number;
    pickedCategory: number | null;
}

// get active games for current user
v1GamesRoute.post('/games', async (req: Request, res: Response) => {

    const reqUser = req.body as User;
    const { username, token  } = reqUser;
    const finished = false;

    if(username && token){

        if(verifyJwt(token, username)){

            let { userGames1, userGames2 } = await userGamesQuery(prisma, username, finished);

            let userGames = userGames1.concat(userGames2);
            let sortedUserGames = userGames.sort((a: userGame, b: userGame) => a.id - b.id);
            let returnedGames: ReturnedGames[] = [];
    
            if(sortedUserGames.length > 0) {
    
                let promise = new Promise<void>((resolve, reject) => {
                    sortedUserGames.forEach(async (game: userGame, index: number) => {
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
                res.status(200);
                res.send([]);
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