import { useQuery } from "react-query";
import { fetchOnlineUsers } from "../../util/fetchers/OnlineUsers";
import { Container, Card, Flex, Space, Button, Loader, Center, Title } from "@mantine/core";
import { UserHorizontal } from "../UserHorizontal";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import { CenterLoader } from "../CenterLoader";
import { gameRequestUrl } from "../../config/ApiUrls";
import axios from "axios";
import { errorNotification, serverErrorNotification } from "../../util/Notifications";
export function OnlineUsersList() {

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];
    const { data, isError, isLoading } = useQuery(['onlineUsers'], fetchOnlineUsers, {
        refetchInterval: 1000
    });

    if(isLoading) {
        return <CenterLoader></CenterLoader>;
    }

    if(isError) {
        return <Center>Error loading online users!</Center>;
    }

    if(data && data.onlineUsers.length < 2) {
        return <Center>No online users!</Center>;
    }

    const requestUser = (enemy: string) => {
        axios.post(gameRequestUrl, {username: auth()!.username, enemy: enemy, token: token}).catch((error) => {
            errorNotification(error)
        })
    }

    return (
        <div>
            {data?.onlineUsers.map(user => (
                auth()!.username === user.username ? null :
                <Container key={user.username}>
                    <Card withBorder>
                        <Flex justify='space-between'>
                            <UserHorizontal username={user.username}></UserHorizontal>
                            <Button onClick={() => requestUser(user.username)}>Anfragen</Button>
                        </Flex>
                    </Card>
                    <Space h={10}></Space>
                </Container>
            ))}
        </div>
    )
}