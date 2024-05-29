import { Flex, ColorSwatch, Text, Avatar, Skeleton } from '@mantine/core';
import { GameStateColorWidget, GameStateColorWidgetProps } from '../gameState/GameStateColorWidget';


export function GameStateCategoryLoading() {

  return (
    <Flex  justify="space-around" align="center" my={20}>
                            
        <Flex>
            <Skeleton height={25} circle mr={5}></Skeleton>
            <Skeleton height={25} circle mr={5}></Skeleton>
            <Skeleton height={25} circle ></Skeleton>
        </Flex>

        <Flex wrap='wrap' w={80} maw={80}>
            <Flex w='100%' justify='center' pb={10}>
            <Skeleton height={40} circle mb={8}></Skeleton>
            </Flex>
            
            <Flex w='100%' justify='center'>
            < Skeleton height={14} radius="xl" w={40}/>
            </Flex>
        </Flex>

        <Flex>
            <Skeleton height={25} circle mr={5}></Skeleton>
            <Skeleton height={25} circle mr={5}></Skeleton>
            <Skeleton height={25} circle ></Skeleton>
        </Flex>
        
    </Flex>
  );
}


