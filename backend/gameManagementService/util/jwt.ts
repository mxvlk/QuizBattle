import { verify } from 'jsonwebtoken';
import { JwtPayload } from './interfaces';

const jwtSecret =  process.env.JWT_SECRET || 'SecureSecretKey';

function verifyJwt(token: string, username: string): Boolean {

    try {
        const decodedToken = verify(token, jwtSecret) as JwtPayload;
        return username === decodedToken.username;
    }
    catch(error){
        return false;
    }
    
}

export {
    verifyJwt
}