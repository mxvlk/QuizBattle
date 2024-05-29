import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { useQuery } from "react-query";
import { fetchActiveGames } from "../../util/fetchers/ActiveGames";
import { useParams } from "react-router-dom";
import { Button, Center, Grid, Loader, Modal, Title } from "@mantine/core";
import { CenterLoader } from "../CenterLoader";
import { MainPageGameView } from "./MainPageGameView";
import { useDisclosure } from "@mantine/hooks";

export function ActiveGamesList() {

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];
    const [opened, { open, close }] = useDisclosure(false);

    const { data, isError, isLoading } = useQuery(['activeGames'], () => fetchActiveGames(auth()!.username, token), {
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
        return <Center>Keine aktiven Spiele!</Center>;
    }

    if(data && data.length > 6) {
        return (
            <div>
                <Modal opened={opened} onClose={close} title={<Title size='h2'>Aktive Spiele</Title>} centered closeButtonProps={{'size':'lg'}}>
                    <Grid>
                        {data?.map(game => (
                            <Grid.Col span={6} key={game.uuid}>
                                <MainPageGameView username={game.enemy} score={game.score} uuid={game.uuid}></MainPageGameView>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Modal>
                <Grid>
                    {data?.slice(0,6).map(game => (
                        <Grid.Col span={4} key={game.uuid}>
                            <MainPageGameView username={game.enemy} score={game.score} uuid={game.uuid}></MainPageGameView>
                        </Grid.Col>
                    ))}
                </Grid>
                <Center>
                    <Button variant='subtle' mt={10} onClick={() => { open(); }}>Mehr Anzeigen</Button>
                </Center>
            </div>
        )
    }

    return (
        <Grid>
            {data?.map(game => (
                <Grid.Col span={4} key={game.uuid}>
                    <MainPageGameView username={game.enemy} score={game.score} uuid={game.uuid}></MainPageGameView>
                </Grid.Col>
            ))}
        </Grid>
    )
}