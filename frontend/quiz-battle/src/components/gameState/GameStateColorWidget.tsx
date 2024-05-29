import { Flex, ColorSwatch } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

export interface GameStateColorWidgetProps {
    answer1?: Boolean,
    answer2?: Boolean,
    answer3?: Boolean
}

function getColor(answer: Boolean | undefined) {

    if(answer === undefined || answer === null){
        return 'white';
    }

    return answer ? '#228be6':'#b6b6b6';
}

export function GameStateColorWidget(props: GameStateColorWidgetProps) {

  return (
    <Flex>
        <ColorSwatch color={getColor(props.answer1)} mr={5}></ColorSwatch>
        <ColorSwatch color={getColor(props.answer2)} mr={5}></ColorSwatch>
        <ColorSwatch color={getColor(props.answer3)}></ColorSwatch>
    </Flex>
  );
}