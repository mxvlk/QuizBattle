import { Flex, ColorSwatch, Text, Avatar } from '@mantine/core';
import { GameStateColorWidget, GameStateColorWidgetProps } from './GameStateColorWidget';
import { CategoryName } from '../../util/Interfaces';


export interface GameStateCategoryProps {
    user1Answer1?: Boolean,
    user1Answer2?: Boolean,
    user1Answer3?: Boolean,
    user2Answer1?: Boolean,
    user2Answer2?: Boolean,
    user2Answer3?: Boolean,
    category: number
}



export function GameStateCategory(props: GameStateCategoryProps) {

    const answersUser1: GameStateColorWidgetProps = {
        answer1: props.user1Answer1,
        answer2: props.user1Answer2,
        answer3: props.user1Answer3
    };

    const answersUser2: GameStateColorWidgetProps = {
        answer1: props.user2Answer1,
        answer2: props.user2Answer2,
        answer3: props.user2Answer3
    };

    console.log(props);

    let categoryStr = CategoryName[props.category];
    const correctSpelling = categoryStr.replaceAll('_', ' ').replaceAll('ue', 'ü').replaceAll('oe', 'ö');

  return (
    <Flex  justify="space-around" align="center" my={20}>
                            
        <GameStateColorWidget {...answersUser1}></GameStateColorWidget>

        <Flex wrap='wrap' w={80} maw={80}>
            <Flex w='100%' justify='center' pb={10}>
                <Avatar radius="xl" variant="outline">
                    {correctSpelling.replaceAll(/[a-z0äöü-]/g, '').replaceAll(' ', '')}
                </Avatar>
            </Flex>
            
            <Flex w='100%' justify='center'>
                <Text lineClamp={2} align="center" size={10}>
                    {correctSpelling}
                </Text>
            </Flex>
        </Flex>

        <GameStateColorWidget {...answersUser2}></GameStateColorWidget>
    </Flex>
  );
}


