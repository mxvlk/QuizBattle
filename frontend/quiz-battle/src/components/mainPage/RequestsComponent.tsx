import { Flex, Text, Avatar, Container, Card, Button, Space } from '@mantine/core';
import { UserHorizontal } from '../UserHorizontal';
import axios from 'axios';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { errorNotification } from '../../util/Notifications';
import { acceptRequestUrl } from '../../config/ApiUrls';

export interface RequestViewProps {
    username: string
}


export function RequestView(props: RequestViewProps) {

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const token = authHeader().split(" ")[1];

  const acceptUser = (enemy: string) => {
    axios.post(acceptRequestUrl, {username: auth()!.username, enemy: enemy, token: token}).catch((error) => {
        errorNotification(error)
    })
}

  return (
    <div>
        <Card withBorder>
            <Flex justify='space-between'>
                <UserHorizontal username={props.username}></UserHorizontal>
                <Button onClick={() => acceptUser(props.username)} variant='outline'>Annehmen</Button>
            </Flex>
        </Card>
    </div>
  );
}


