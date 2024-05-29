import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import bcrypt from 'bcrypt';
import { NewUser } from '../../util/userInterface';
import { getAccessTokenJSON } from '../../util/jwt';
import { HTTP_CREATED, HTTP_UNAUTHORIZED } from '../../util/httpCodes';


export const v1RegisterRoute = express.Router();

const minUsernameLength = 3;
const minPasswordLength = 5;

const bCryptHashRounds = 5;

// register function
v1RegisterRoute.post('/register', async (req: Request, res: Response) => {

    // map to new user
    const newUser = req.body as NewUser;

    // check if the registration token is correct
    if(newUser.registerToken === 'TIN21'){

        // check if all fields exist
        if(newUser.username && newUser.password && newUser.repeatPassword ) {
            
            // check if passwords match
            if(newUser.password === newUser.repeatPassword) {

                // check if password and username length constrains are met
                if(newUser.password.length >= minPasswordLength && newUser.username.length >= minUsernameLength) {

                    const usernameExists = await prisma.user.findUnique(
                        {
                            where: {
                                username:  newUser.username
                            }
                        }
                    );

                    // check if username already exists
                    if(usernameExists) {
                        res.status(HTTP_UNAUTHORIZED);
                        res.send('Username already exists!');
                    }
                    else {
                        // calculate password hash
                        const passwordHash = await bcrypt.hash(newUser.password, bCryptHashRounds);

                        // create new user in db
                        const user = await prisma.user.create({
                            data: {
                                username: newUser.username,
                                password: passwordHash
                            }
                        });
                        
                        res.status(HTTP_CREATED)
                        res.setHeader('Content-Type', 'application/json');
                        res.end(getAccessTokenJSON(user.username));
                    }
                }
                else {
                    res.status(HTTP_UNAUTHORIZED);
                    res.send('Username or password too short!');
                }
                
            }
            else {
                res.status(HTTP_UNAUTHORIZED);
                res.send('Passwords dont match');
            }
        }
        else {
            res.sendStatus(HTTP_UNAUTHORIZED);
        }
    }
    else {
        res.sendStatus(HTTP_UNAUTHORIZED);
    }

});