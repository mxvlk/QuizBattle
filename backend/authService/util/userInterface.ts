interface LoginUser {
    username: string,
    password: string
}


interface NewUser {
    registerToken: string,
    username: string,
    password: string,
    repeatPassword: string
}

export {
    LoginUser,
    NewUser
}