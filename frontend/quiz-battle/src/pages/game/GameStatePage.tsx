import { Container, Text, Flex, ActionIcon, Card, Space,Center, Button } from "@mantine/core";
import { DarkModeToggle } from "../../components/DarkMode";
import { IconArrowLeft } from '@tabler/icons-react';
import { GameStateCategory } from "../../components/gameState/GameStateCategory";
import { User } from "../../components/User";
import { useLocation, useNavigate } from 'react-router-dom';
import { categoryPath, mainPagePath, questionPath } from "../../config/InternalPaths";
import { UserLoading } from "../../components/loading/UserLoading";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { useQuery, useQueryClient } from "react-query";
import { fetchGameState } from "../../util/fetchers/GameState";
import { GameStateScore } from "../../components/gameState/GameStateScore";
import { GameStateQuestionLoading } from "../../components/loading/GameStateQuestionLoading";
import { Task } from "../../util/Interfaces";


function GameStatePage() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { uuid } = state;

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];

    const { data, isError, isLoading } = useQuery(['gameState', uuid], () => fetchGameState(auth()!.username, token, uuid), {
        refetchInterval: 1500
    });

    return (
        <Container my={20}>

            <Flex  justify="space-between">
                <ActionIcon variant="transparent" onClick={() => {navigate(mainPagePath);}}>
                    <IconArrowLeft size={50} />
                </ActionIcon>
                <Text size={20}>
                    {data?.task == Task.Finished ? "Beendet" : data?.currentPlayer == auth()!.username ? "Du bist dran" : "Dein Gegner spielt gerade"}
                </Text>
                <DarkModeToggle></DarkModeToggle>
            </Flex>

            <Space h={20}></Space>

            <Card withBorder padding="s" radius="md">
                <Flex  justify="space-around" align="center" my={20}>
                    {isLoading ? <UserLoading></UserLoading> : <User username={data?.user1 || "User 1"}></User>}
                    
                    <GameStateScore username={auth()!.username} token={token} uuid={uuid}></GameStateScore>

                    {isLoading ? <UserLoading></UserLoading> : <User username={data?.user2 || "User 2"}></User>}
                </Flex>
            </Card>

            {data != null && data.task != Task.Finished ? data.currentPlayer == auth()!.username ? 

                <Center mt={20}>
                    <Button onClick={() => {
                        navigate(data.task == Task.ChooseCategory ? categoryPath : questionPath, {state: {uuid: uuid }});
                    }}>Spielen</Button> 
                </Center>
                : null
                : data?.task == Task.Finished ? <Center mt={20}>Spiel beendet</Center> : "Error"}

            {isError ? <Center>Error loading game!</Center> : null}

            {isLoading ?
                <GameStateQuestionLoading></GameStateQuestionLoading>
                :
                data?.questions.map(question => (
                    <div key={question.id}>
                        <Space h={20}></Space>
                        <Card withBorder padding="s" radius="md">
                            <GameStateCategory 
                                category={question.category}
                                user1Answer1={question.user1_answer1} 
                                user1Answer2={question.user1_answer2}
                                user1Answer3={question.user1_answer3}
                                user2Answer1={question.user2_answer1}
                                user2Answer2={question.user2_answer2}
                                user2Answer3={question.user2_answer3}
                            ></GameStateCategory>
                        </Card>   
                    </div>
                ))
            }

        </Container>
      );
}

export default GameStatePage;