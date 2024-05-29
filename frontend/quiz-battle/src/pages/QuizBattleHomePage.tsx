import { Container, Title, Text, Button, Center, Space, Image, Flex } from "@mantine/core";
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from "../components/DarkMode";
import { loginPath, registerPath } from "../config/InternalPaths";

function HomePage() {
    const navigate = useNavigate();

    return (
        <Container my={20}>

            <Flex justify="flex-end">
                <DarkModeToggle></DarkModeToggle>

            </Flex>

            <Image maw={100} mx="auto" src="/logo512.png" alt="QuizBattle Logo" my={20}></Image>
            <Title align="center">Willkommen bei QuizBattle</Title>

            <Space h={40}></Space>

            <Text align='center'>
                Spiele jetzt QuizBattle und quizze in aufregenden Duellen online gegen deine Freunde. Bist du bereit dich den epischen Wissensschlachten zu stellen?
            </Text>

            <Space h={140}></Space>

            <Center>
                <Button w={150} variant="gradient" onClick={() => {navigate(loginPath);}}>
                    Login
                </Button>
            </Center>
            <Space h={20}></Space>
            <Center>
                <Button w={150} variant="outline" onClick={() => {navigate(registerPath);}}>
                    Registrieren
                </Button>
            </Center>
        
        </Container>
      );
}

export default HomePage;