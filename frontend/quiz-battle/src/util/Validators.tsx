const validateUsername = (value: String) => {
    if(value.length < 3){
        return 'Dein Username muss aus mindestens 3 Zeichen bestehen';
    }
    return null;
}

const validatePasswordRepeat = (value: String, values: { username: string; password: string; repeatPassword: string; }) => {
    if(value !== values.password){
        return 'Die beiden Passwörter sind nicht gleich';
    }
    if(value.length < 5){
        return 'Dein Passwort muss mindestens aus 5 Zeichen bestehen';
    }
    return null;
}

const validatePassword = (value: String) => {
    if(value.length < 5){
        return 'Dein Passwort muss mindestens aus 5 Zeichen bestehen';
    }
    return null;
}

export {
    validateUsername,
    validatePasswordRepeat,
    validatePassword
}