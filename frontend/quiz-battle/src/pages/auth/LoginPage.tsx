import { useNavigate } from 'react-router-dom';
import { TextInput, ActionIcon, PasswordInput, Button, Title, Container, Paper, Space, Flex } from '@mantine/core';
import { DarkModeToggle } from '../../components/DarkMode';
import { IconArrowLeft } from '@tabler/icons-react';
import { indexPath, registerPath } from '../../config/InternalPaths';
import { useForm } from '@mantine/form';
import { validatePassword, validateUsername } from '../../util/Validators';
import axios from "axios";
import { loginUrl } from "../../config/ApiUrls";
import { HTTP_OK, HTTP_UNAUTHORIZED } from '../../util/HttpStatus';
import { useSignIn } from "react-auth-kit";
import { mainPagePath } from "../../config/InternalPaths";
import { invalidCredentialsNotification, serverErrorNotification, somethingWentWrongNotification, wrongCredentialsNotification } from '../../util/Notifications';


function LoginPage() {

    const signIn = useSignIn();
    const navigate = useNavigate();

    const sendLoginToServer = (values: { username: string; password: string;}, event: React.FormEvent<HTMLFormElement>) => {
        axios.post(loginUrl, values)
        .then((res)=>{
    
            if(res.status === HTTP_OK){
                if(signIn(
                    {
                        token: res.data.token,
                        expiresIn:res.data.expiresIn,
                        tokenType: "Bearer",
                        authState: res.data.authUserState
                    }
                )){
                    navigate(mainPagePath);
                }else {
                    somethingWentWrongNotification();
                }
            }
            else if(res.status === HTTP_UNAUTHORIZED){
                wrongCredentialsNotification();
            }
            else{
                somethingWentWrongNotification();
            }
        })
        .catch((error) => {
            if(!error.response){
                serverErrorNotification();
            }
            else {
                if(error.response.status === HTTP_UNAUTHORIZED){
                    invalidCredentialsNotification();
                }
                else {
                    serverErrorNotification();
                }
            }
        });
    }

    const loginFormData = useForm({
        initialValues: {
          username: '',
          password: ''
        },
        validate: {
            username: validateUsername,
            password: validatePassword
        }
    });

    return (
        <Container size={420} my={20}>
            <Flex  justify="space-between" align="center">
                <ActionIcon variant="transparent" onClick={() => {navigate(indexPath);}} aria-label='Back Button'>
                    <IconArrowLeft size={50} />
                </ActionIcon>
                <DarkModeToggle></DarkModeToggle>
            </Flex>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title align="center">
                    Willkommen zurück!
                </Title>
                <Space h={50} />
                <form onSubmit={loginFormData.onSubmit(sendLoginToServer)}>  
                    <TextInput  label="Username" {...loginFormData.getInputProps('username')} placeholder="Dein Username" aria-label='Username Input'></TextInput>
                    <PasswordInput label="Passwort" {...loginFormData.getInputProps('password')} placeholder="Dein Passwort" mt="md" aria-label='Password Input'></PasswordInput>
                    <Button type="submit" variant="gradient" fullWidth mt="xl" aria-label='Submit Button'>
                        Login
                    </Button>
                </form>
                <Button fullWidth mt="xl" variant="outline" onClick={() => {navigate(registerPath);}}>
                    Registrieren
                </Button>
            </Paper>
        </Container>
    );
}

export default LoginPage;