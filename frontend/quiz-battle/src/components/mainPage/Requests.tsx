import { useQuery } from "react-query";
import { fetchOnlineUsers } from "../../util/fetchers/OnlineUsers";
import { Container, Card, Flex, Space, Button, Loader, Center, Title, Grid, ScrollArea, Modal } from "@mantine/core";
import { UserHorizontal } from "../UserHorizontal";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { CenterLoader } from "../CenterLoader";
import { fetchRequests } from "../../util/fetchers/Requests";
import { User } from "../User";
import { RequestView } from "./RequestsComponent";
import { useDisclosure } from "@mantine/hooks";

export function RequestsList() {

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];
    const [opened, { open, close }] = useDisclosure(false);
    
    const { data, isError, isLoading } = useQuery(['requests'], () => fetchRequests(auth()!.username, token), {
        refetchInterval: 1000,
        retry: 1
    });

    if(isLoading) {
        return <CenterLoader></CenterLoader>;
    }

    if(isError) {
        return <Center>Error!</Center>;
    }

    if(data?.length === 0) {
        return <Center>Keine Anfragen! 😢</Center>;
    }

    if(data && data.length > 2){
        return (

            <div>

                <Modal opened={opened} onClose={close} title={<Title size='h2'>Requests</Title>} centered closeButtonProps={{'size':'lg'}}>
                            <Space h={10}></Space>
                            {data?.map(playRequest => (
                                <div>
                                    <RequestView username={playRequest.user}></RequestView>
                                    <Space h={10}></Space>
                                </div>
                            ))}
                </Modal>
        

            {data?.slice(0,2).map(playRequest => (
                <div>
                    <RequestView username={playRequest.user}></RequestView>
                    <Space h={10}></Space>
                </div>
            ))}
            <Center>
                <Button variant='subtle' onClick={() => { open(); }}>Mehr Anzeigen</Button>
            </Center>
        </div>
        )  
    }

    return (
            <div>
                {data?.map(playRequest => (
                    <div>
                        <RequestView username={playRequest.user}></RequestView>
                        <Space h={10}></Space>
                    </div>
                ))}
            </div>
    )
}