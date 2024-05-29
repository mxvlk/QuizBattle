import { sign } from 'jsonwebtoken';

const accessTokenExpireTime =  {
    number: 120,
    string: '2h'
};
const verySecretKey = 'secureSecretKey';

// signs the access token with the secret
function generateAccessToken(username: String) {
    return sign({'username': username}, process.env.JWT_SECRET || verySecretKey, {
        expiresIn: process.env.JWT_EXPIRE_TIME_STR || accessTokenExpireTime.string
    });
}

// retruns the acces token in the correct JSON fromat
function getAccessTokenJSON(username: String){
    const accessToken = generateAccessToken(username);

    return JSON.stringify({
        token: accessToken,
        expiresIn: process.env.JWT_EXPIRE_TIME_NUM || accessTokenExpireTime.number,
        authUserState: {username: username}
    });
}


export {
    getAccessTokenJSON
}