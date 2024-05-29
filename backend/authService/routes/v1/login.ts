import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { getAccessTokenJSON } from '../../util/jwt';
import bcrypt from 'bcrypt';
import { LoginUser } from '../../util/userInterface';
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED } from '../../util/httpCodes';


export const v1LoginRoute = express.Router();

// login function
v1LoginRoute.post('/login', async (req: Request, res: Response) => {

    const loginUser = req.body as LoginUser;

    // check if username and password exist in the request
    if(loginUser.username && loginUser.password){
        
        // search for username in database
        const userExists = await prisma.user.findUnique(
            {
                where: {
                    username: loginUser.username
                }
            }
        );

        //continue if the user exists
        if(userExists) {
            // check if password is correct
            const passwordMatches = await bcrypt.compare(loginUser.password, userExists.password);

            //continue if true
            if(passwordMatches) {
                console.log('pass matches');

                res.setHeader('Content-Type', 'application/json');
                res.end(getAccessTokenJSON(userExists.username));
            }
            else {
                res.sendStatus(HTTP_UNAUTHORIZED);
            }
        }
        else {
            res.status(HTTP_UNAUTHORIZED);
            res.send('Username does not exist');
        }
    }
    else {
        res.sendStatus(HTTP_UNAUTHORIZED);
    }

});