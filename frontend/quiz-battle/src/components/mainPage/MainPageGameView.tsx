import { Flex, Card, Title, UnstyledButton } from '@mantine/core';
import { User } from "../User";
import { useNavigate } from 'react-router-dom';
import { gameStatePath } from '../../config/InternalPaths';

export interface MainPageGameViewProps {
    username: string,
    score: string,
    uuid: string
}

export function MainPageGameView(props: MainPageGameViewProps) {

  const navigate = useNavigate();

  return (
    <UnstyledButton h='100%' w='100%' key={props.uuid} onClick={() => {navigate(gameStatePath, {state: {uuid: props.uuid}})}}>
        <Card withBorder padding="s" radius="md">
            <Flex justify='center' align='center' pt={10} pb={5} h='100%' wrap='wrap'>
                <Flex w='100%' justify='center'>
                    <User username={props.username}></User>
                </Flex>
                <Title size='h3'>
                    {props.score}
                </Title>
            </Flex>
        </Card>
    </UnstyledButton>
  );
}

