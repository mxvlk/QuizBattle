import { Flex, Text, Avatar } from '@mantine/core';

export interface UserProps {
    username: String
}

export function User(props: UserProps) {

  return (
    <Flex wrap='wrap' w={80} maw={80}>
        <Flex w='100%' justify='center' pb={10}>
            <Avatar radius="xl" variant="outline"></Avatar>
        </Flex>
    
        <Flex w='100%' justify='center'>
            <Text truncate align="center">{props.username}</Text>
        </Flex> 
    </Flex>
  );
}


