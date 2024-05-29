import { Flex, Text, Avatar } from '@mantine/core';

export interface UserHorizontalProps {
    username: String
}

export function UserHorizontal(props: UserHorizontalProps) {

  return (
    <Flex align='center' maw={140}>  
        <Avatar radius="xl" variant="outline" mr={10}></Avatar>
        <Text truncate>
            {props.username}
        </Text>
    </Flex> 
  );
}


