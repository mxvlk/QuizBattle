import { Container, Title, Text, Button, Center, Space } from "@mantine/core";
import { useNavigate } from 'react-router-dom';
import { indexPath } from "../config/InternalPaths";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container my={60}>
            <Center>
                <Title size={100}>404</Title>
            </Center>
            <Center>
                <Title size={30}>Not found</Title>
            </Center>
            <Space h={50}></Space>
            <Center>
                <Button w={150} variant="gradient" onClick={() => {navigate(indexPath);}}>
                    Go back
                </Button>
            </Center>
        </Container>
      );
}

export default NotFoundPage;