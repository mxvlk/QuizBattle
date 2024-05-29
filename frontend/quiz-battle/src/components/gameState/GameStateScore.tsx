import { useQuery } from "react-query";
import { fetchScore } from "../../util/fetchers/Score";
import { ScoreLoading } from "../loading/ScoreLoading";
import { Title } from "@mantine/core";

export interface GameStateScoreProps {
    username: string,
    token: string,
    uuid: string
}

export function GameStateScore(props: GameStateScoreProps) {
    
    const { data, isError, isLoading } = useQuery(['gameStateScore', props.uuid], () => fetchScore(props.username, props.token, props.uuid), {
        refetchInterval: 10000
    });

    if(isError) {
        return <Title>0:0</Title>;
    }

    if(isLoading) {
        return <ScoreLoading></ScoreLoading>;
    }

    return (
        <Title>
            {data?.score}
        </Title>
    )

    
}