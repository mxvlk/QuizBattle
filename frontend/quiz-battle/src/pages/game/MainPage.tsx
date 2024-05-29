import { Container, Title, Grid, Button, Center, Space, Image, Flex, Modal, Card, Badge } from "@mantine/core";
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from "../../components/DarkMode";
import { useDisclosure } from '@mantine/hooks';
import { easterEggMessage } from "../../util/Notifications";
import { useState } from "react";
import { useSignOut, useAuthUser } from 'react-auth-kit'
import { UserHorizontal } from "../../components/UserHorizontal";
import { categoryPath, indexPath, questionPath } from "../../config/InternalPaths";
import { OnlineUsersList } from "../../components/mainPage/OnlineUsersList";
import { ActiveGamesList } from "../../components/mainPage/ActiveGamesList";
import { RequestsList } from "../../components/mainPage/Requests";
import { FinishedGamesList } from "../../components/mainPage/FinishedGamesList";

function MainPage() {
    const navigate = useNavigate();
    const signOut = useSignOut();
    const auth = useAuthUser();

    const [opened, { open, close }] = useDisclosure(false);
    const [counter, setCounter] = useState(0);

    const updateCount = (n: number) => {
        if(n < 9){
            setCounter(counter+1);
        }
        else{
            easterEggMessage();
            setCounter(0);
        }
    };

    const logOut = () => {
        if(signOut()){
            navigate(indexPath);
        }
        else {
            console.log('error');
        }
    }

    return (
        
        <Container my={20}>

            <Modal opened={opened} onClose={close} title={<Title size='h2'>Online Users</Title>} centered closeButtonProps={{'size':'lg'}}>
                <Space h={10}></Space>
                <OnlineUsersList></OnlineUsersList>
            </Modal>

            <Grid>
                <Grid.Col span={4}>
                    <Button variant="outline" onClick={logOut}>
                        Logout
                    </Button>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image maw={40} mx="auto" src="/logo512.png" alt="QuizBattle Logo" onClick={() => {updateCount(counter);}}></Image>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Flex justify='flex-end' w='100%'>
                        <DarkModeToggle></DarkModeToggle>
                    </Flex>  
                </Grid.Col>
            </Grid>

            <Space h={10}></Space>

            <Center>
                <Badge color="blue" variant="outline">online</Badge>
            </Center>

            <Space h={10}></Space>

            <Card withBorder mb={20}>
                <Flex justify='space-between' align='center' w='100%'>
                    <UserHorizontal username={auth()!.username}></UserHorizontal>
                    <Title size='h3'>
                        0:0
                    </Title>
                </Flex> 
               
            </Card>

            <Center>
                <Button variant="gradient" onClick={() => { open(); }}>
                    Neues Spiel
                </Button>
            </Center>
            <Space h={20}></Space>

            <Title size='h2' mb={20}>Anfragen</Title>
            <RequestsList></RequestsList>
            
            <Space h={20}></Space>

            <Title size='h2' mb={20}>Aktive Spiele</Title>
            <ActiveGamesList></ActiveGamesList>

            <Space h={20}></Space>

            <Title size='h2' mb={20}>Beendet Spiele</Title>
            <FinishedGamesList></FinishedGamesList>

        </Container>
      );
}

export default MainPage;