import { Card, Space } from "@mantine/core";
import { GameStateCategoryLoading } from "./GameStateCategoryLoading";

export function GameStateQuestionLoading() {
    return (
        <div>
            <Space h={20}></Space>
            <Card withBorder padding="s" radius="md">
                <GameStateCategoryLoading></GameStateCategoryLoading>
            </Card>
            <Space h={20}></Space>
            <Card withBorder padding="s" radius="md">
                <GameStateCategoryLoading></GameStateCategoryLoading>
            </Card>
            <Space h={20}></Space>
            <Card withBorder padding="s" radius="md">
                <GameStateCategoryLoading></GameStateCategoryLoading>
            </Card>
        </div>
    )

}