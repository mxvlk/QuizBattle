import { Container, Text, Card, UnstyledButton, createStyles, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { questionPath } from '../../config/InternalPaths';
import { useState } from 'react';
import axios from 'axios';
import { chooseCategoryUrl } from '../../config/ApiUrls';
import { UserWithCategory, UserWithUUID } from '../../util/Interfaces';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';

const useStyles = createStyles((theme) => ({
    cardImage: {
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
}));

export interface CategoryProps {
    category: String,
    categoryId: number,
    uuid: String
}

export function Category(props: CategoryProps) {

  const { classes } = useStyles();
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const imgPath = props.category.replaceAll(' ', '_').replaceAll('ö', 'oe').replaceAll('ü', 'ue');
  const image = `categories/${imgPath}.webp`;
  const correctSpelling = props.category.replaceAll('_', ' ').replaceAll('ue', 'ü').replaceAll('oe', 'ö');

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const token = authHeader().split(" ")[1];

  const [buttonClicked, setButtonClicked] = useState(false);
    
  return (
        <UnstyledButton mt='xl' w='100%' onClick={() => {
          setButtonClicked(true);
            setTimeout(() => {
              axios
              .post(chooseCategoryUrl, {username: auth()!.username, token: token, uuid: props.uuid, category: props.categoryId} as UserWithCategory)
              .then(res => res.data);
              navigate(questionPath, {state: {uuid: props.uuid}});
            }, 500);
           }}>
            <Card withBorder padding="s" radius="md" bg={buttonClicked ? "#228be6" : colorScheme === "dark" ? "black" : "white" }>
                <Card.Section sx={{ backgroundImage: `url(${image})`}} h={90} className={classes.cardImage}/>
                <Text align='center' size={18} my={8}>{correctSpelling}</Text>
            </Card>
        </UnstyledButton>
  );
}