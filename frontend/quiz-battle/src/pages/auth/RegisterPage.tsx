import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Title, Container, Paper, Space, Flex, ActionIcon } from '@mantine/core';
import { DarkModeToggle } from '../../components/DarkMode';
import { IconArrowLeft } from '@tabler/icons-react';
import { indexPath, mainPagePath } from '../../config/InternalPaths';
import { useForm } from '@mantine/form';
import { validatePasswordRepeat, validateUsername } from '../../util/Validators';
import { useSignIn } from 'react-auth-kit';
import axios from 'axios';
import { registerUrl } from '../../config/ApiUrls';
import { HTTP_CREATED, HTTP_UNAUTHORIZED } from '../../util/HttpStatus';
import { authTokenType } from '../../config/Token';
import { invalidCredentialsNotification, serverErrorNotification, somethingWentWrongNotification } from '../../util/Notifications';

function RegisterPage() {

    const navigate = useNavigate();
    const signIn = useSignIn();

    const registerFormData = useForm({
        initialValues: {
          registerToken: '',
          username: '',
          password: '',
          repeatPassword: ''
        },
        validate: {
            username: validateUsername,
            repeatPassword: validatePasswordRepeat
        }
    });

    const sendRegisterToServer = (values: { username: string; password: string; repeatPassword: string; registerToken: string; }, event: React.FormEvent<HTMLFormElement>) => {
    
axios.post(registerUrl, values)
        .then((res)=>{
            if(res.status === HTTP_CREATED){
                if(signIn(
                    {
                        token: res.data.token,
                        expiresIn:res.data.expiresIn,
                        authState: res.data.authUserState,
                        tokenType: authTokenType
                    }
                )){
                    navigate(mainPagePath);
                }else {
                    somethingWentWrongNotification();
                }
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
            console.log(error);
        });
    }

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
                    Registrieren
                </Title>
                <Space h={50}></Space>
                <form onSubmit={registerFormData.onSubmit(sendRegisterToServer)}>  
                    <TextInput  label="Anmeldeschlüssel" {...registerFormData.getInputProps('registerToken')} placeholder="Dein Anmeldeschlüssel" aria-label='Registration Token Input'></TextInput>
                    <TextInput  label="Username" {...registerFormData.getInputProps('username')} placeholder="Dein Username" mt="md" aria-label='Username Input'></TextInput>
                    <PasswordInput label="Passwort" {...registerFormData.getInputProps('password')} placeholder="Dein Passwort" mt="md" aria-label='Password Input'></PasswordInput>
                    <PasswordInput label="Passwort wiederholen" {...registerFormData.getInputProps('repeatPassword')} placeholder="Nochmal dein Passwort" mt="md" aria-label='Password Input again'></PasswordInput>
                    <Button type="submit" variant="gradient" fullWidth mt="xl" aria-label='Register Button'>
                        Register
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default RegisterPage;