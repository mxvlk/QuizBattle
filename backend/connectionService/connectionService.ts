import express, { response } from 'express';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import onlineUser from './util/onlineUser';
import authUser from './util/authUser';
import jwtPayload from './util/jwtPayload';
import { HTTP_BAD_REQUEST, HTTP_CREATED, HTTP_OK, HTTP_UNAUTHORIZED } from './util/httpStatusCodes';
import gameRequestUser from './util/gameRequestUser';
import gameRequest from './util/gameRequest';

// Constants
const PORT = Number(process.env.PORT) || 5001;
const HOST = '0.0.0.0';

const maxNoPingTimeInS = Number(process.env.CONNECTION_PING_TIMEOUT) || 20;
const maxGameRequestAliveTimeInM = Number(process.env.GAME_REQUEST_ALIVE_TIME) || 60;
const jwtSecret =  process.env.JWT_SECRET|| 'SecureSecretKey';
const checkPingInterval = 5000;
const checkGameRequestsInterval = 1000;
const createNewGameSecret = process.env.CREATE_NEW_GAME_SECRET || "createGameSecret";
const createNewGameUrl = process.env.CREATE_NEW_GAME_URL || "http://127.0.0.1:5000/api/v1/createGame";

// App
const app = express();
// online Users Array
let onlineUsers: onlineUser[] = [];
let gameRequests: gameRequest[] = [];

// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// check pings every checkPingInterval seconds and delete pings older then maxNoPingTimeInS
function checkPings(){
    setInterval(() => {
        const before = Date.now() - maxNoPingTimeInS*1000;
        onlineUsers.forEach((user, index, array) => {
            if(user.lastPing < before) {
                array.splice(index, 1);
            }
        });
    }, checkPingInterval);
}

// check game requests every checkGameRequestsInterval seconds and delete if older then maxGameRequestAliveTimeInM (in m)
// also: create new game if both users accepted and no game has been created yet
function checkGameRequests(){
    setInterval(() => {
        const before = Date.now() - maxGameRequestAliveTimeInM*60*1000;
        gameRequests.forEach((request, index, array) => {
            if(request.time < before || request.gameCreated) {
                array.splice(index, 1);
            }

            if(request.accepted && !request.gameCreated) {
                //create new game
                let body = { 
                    user1: request.user,
                    user2: request.enemy,
                    secret: createNewGameSecret
                }
                console.log(createNewGameUrl, createNewGameSecret);
                fetch(createNewGameUrl, {
                    body: JSON.stringify(body),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    if (response.status == HTTP_CREATED) {
                        console.log("game created!")
                        request.gameCreated = true;
                    }
                    else{
                        console.log("error creating game!")
                    }
                });
            }
        });
    }, checkGameRequestsInterval);
}

// return all online users
app.get('/onlineUsers', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        onlineUsers: onlineUsers
    }));
});

// return requests to play for current user
app.post('/requests', (req, res) => {
    const user = req.body as authUser;

    if(user.username && user.token){
        try {
            const decodedToken = verify(user.token, jwtSecret) as jwtPayload;
    
            if(user.username === decodedToken.username){
                let requests: gameRequest[] = [];
                gameRequests.forEach((request) => {
                    if(request.enemy === user.username){
                        requests.push(request);
                    }
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(requests));
            }
            else {
                res.status(HTTP_UNAUTHORIZED);
                res.send('Token username doesnt match!');
            }
        }
        catch(error) {
            res.status(HTTP_UNAUTHORIZED);
            res.send('Token is faulty!');
        }
    }
    else {
        res.sendStatus(HTTP_BAD_REQUEST)
    }
});

// accept a request to play
app.post('/acceptRequest', (req, res) => {
    const user = req.body as gameRequestUser;
    const enemy = user.enemy;

    if(user.username && user.token && enemy){
        try {
            const decodedToken = verify(user.token, jwtSecret) as jwtPayload;
    
            if(user.username === decodedToken.username){
                let requestFound = false;
                gameRequests.forEach((request) => {
                    if(request.enemy === user.username && request.user === enemy){
                        request.accepted = true;
                        requestFound = true;
                    }
                });

                if(requestFound){
                    res.sendStatus(200);
                }
                else {
                    res.status(404);
                    res.send("Game request not found");
                }
            }
            else {
                res.status(HTTP_UNAUTHORIZED);
                res.send('Token username doesnt match!');
            }
        }
        catch(error) {
            res.status(HTTP_UNAUTHORIZED);
            res.send('Token is faulty!');
        }
    }
    else {
        res.sendStatus(HTTP_BAD_REQUEST)
    }
});

// send a request to play to a user
app.post('/gameRequest', (req, res) => {
    const user = req.body as gameRequestUser;
    const enemy = user.enemy;

    if(user.username && user.token && enemy){
        try {
            const decodedToken = verify(user.token, jwtSecret) as jwtPayload;
    
            if(user.username === decodedToken.username){

                if(onlineUsers.some((onlineUser) => onlineUser.username === enemy)){

                    if(!gameRequests.some((request) => request.user === user.username && enemy)){
                        gameRequests.push({
                            user: user.username,
                            enemy: enemy,
                            time: Date.now(),
                            accepted: false,
                            gameCreated: false
                        });
                        
                        res.sendStatus(200);
                    }
                    else {
                        res.status(200);
                        res.send("Enemy already requested");
                    }
                    console.log(gameRequests);

                }
                else {
                    res.status(404);
                    res.send("Enemy not online");
                }
                
            }
            else {
                res.status(HTTP_UNAUTHORIZED);
                res.send('Token username doesnt match!');
            }
        }
        catch(error) {
            res.status(HTTP_UNAUTHORIZED);
            res.send('Token is faulty!');
        }
    }
    else {
        res.sendStatus(HTTP_BAD_REQUEST)
    }

});

// ping the server to be seen as a online user
app.post('/ping', (req, res) => {
    const user = req.body as authUser;

    if(user.token && user.username){
        try {
            const decodedToken = verify(user.token, jwtSecret) as jwtPayload;
    
            if(user.username === decodedToken.username){
    
                if(Math.round(Date.now() / 1000) < decodedToken.exp) {
    
                    let notInListAlready = true;
    
                    onlineUsers.forEach((onlineUser) => {
                        if(user.username === onlineUser.username){
                            onlineUser.lastPing = Date.now();
                            notInListAlready = false;
                        }
                    });
    
                    if(notInListAlready) {
                        onlineUsers.push({
                            username: user.username,
                            lastPing: Date.now()
                        });
                    }
    
                    res.sendStatus(HTTP_OK);
                }
                else{
                    res.status(HTTP_UNAUTHORIZED);
                    res.send('Token expired!');
                }
            }
            else {
                res.status(HTTP_UNAUTHORIZED);
                res.send('Token username doesnt match!');
            }
        }
        catch(error) {
            res.status(HTTP_UNAUTHORIZED);
            res.send('Token is faulty!');
        }
    }
    else {
        res.sendStatus(HTTP_BAD_REQUEST);
    }

   
});

//check if the pings are recent
checkPings();
//check if the game requests are recent
checkGameRequests();

// Start the actual server
app.listen(PORT, HOST, 1, () => {console.log(`Running on http://${HOST}:${PORT}`);});
