import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Categories, NewGame, Task } from '../../util/interfaces';
import { randomUUID } from 'crypto';
import { createGameSecretKey, getCategoriesURL } from '../../util/config';

export const v1CreateGameRoute = express.Router();

// create a new game (only possible for the connection service, user should not know createGameSecretKey)
v1CreateGameRoute.post('/createGame', async (req: Request, res: Response) => {

    const reqGame = req.body as NewGame;
    const { user1, user2, secret } = reqGame;
    console.log(req.body)
    if(user1 && user2 && secret){

        console.log(createGameSecretKey);

        if(secret === createGameSecretKey) { 
            try { 
                let data = await fetch(getCategoriesURL).then(response => response.json());
                let categories = data as Categories;

                let game = await prisma.game.create({
                    data: {
                        uuid: randomUUID(),
                        user1: user1,
                        user2: user2,
                        finished: false,
                        currentPlayer: user2,
                        task: Task.ChooseCategory,
                        currentCategories: {
                            create: {
                                category1: categories[0].name,
                                category1_id: categories[0].id,
                                category2: categories[1].name,
                                category2_id: categories[1].id,
                                category3: categories[2].name,
                                category3_id: categories[2].id
                            }
                        }
                    }
                });

                if(game){
                    res.sendStatus(201);
                }
                else{
                    res.status(500);
                    res.send("Could not create game");
                }
            }
            catch(error) {
                console.log(error);
                res.status(500);
                res.send("Could not create game");
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