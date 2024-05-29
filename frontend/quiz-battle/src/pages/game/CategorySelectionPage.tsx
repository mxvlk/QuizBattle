import { Container, Title, Text, Button, Center, Space, Image, Flex, Loader } from "@mantine/core";
import { CategorySelector, CategorySelectorProps } from "../../components/category/CategorySelector";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../util/fetchers/GetCategories";
import { useQuery, useQueryClient } from "react-query"; 
import { useAuthHeader, useAuthUser } from "react-auth-kit";

function CategorySelectionPage() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const { uuid } = state;

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];

    const { data, isError, isLoading } = useQuery(['categories', uuid], () => fetchCategories(auth()!.username, token, uuid), {
        retry: false
    });

    let categories: CategorySelectorProps;

    if(data) {
        categories = {
            firstCategory: data.gameDetail.category1,
            secondCategory: data.gameDetail.category2,
            thirdCategory: data.gameDetail.category3,
            firstCategoryId: data.gameDetail.category1_id,
            secondCategoryId: data.gameDetail.category2_id,
            thirdCategoryId: data.gameDetail.category3_id,
            uuid: uuid
        };

        return (
            <Container my={20}>
    
                <Title align="center" size='h2'>Wähle eine Kategorie:</Title>
    
                <CategorySelector {...categories}></CategorySelector>
    
            </Container>
          );
    }

    if(isError) {
        return <Text>Error</Text>
    }

    if(isLoading) {
        return <Center mt={60}><Loader></Loader></Center>
    }

    return <Text>Error</Text>

}

export default CategorySelectionPage;