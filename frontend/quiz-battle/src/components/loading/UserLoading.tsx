import { Flex, Text, Avatar, Skeleton } from '@mantine/core';

export function UserLoading() {

  return (
    <Flex wrap='wrap' w={80} maw={80}>
        <Flex w='100%' justify='center' pb={10}>
            <Skeleton height={40} circle mb={8}></Skeleton>
        </Flex>
    
        <Flex w='100%' justify='center'>
            <Skeleton height={14} radius="xl" />
        </Flex> 
    </Flex>
  );
}


