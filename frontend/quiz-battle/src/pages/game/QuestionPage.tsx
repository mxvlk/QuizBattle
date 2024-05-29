import { Container, Title, Text, Space, Grid, Card, Loader, Center } from "@mantine/core";
import { Answer } from "../../components/question/Answer";
import { useEffect, useState } from "react";
import axios from "axios";
import { chooseAnswerUrl } from "../../config/ApiUrls";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { UserWithAnswer, UserWithCategory } from "../../util/Interfaces";
import { useQuery, useQueryClient } from "react-query";
import { fetchQuestion } from "../../util/fetchers/GetQuestion";
import { gameStatePath } from "../../config/InternalPaths";
import { type } from "os";

interface answer {
    answerCorrect: boolean
}

type AnswerOrUndefined = boolean | undefined;

type AnswerArray = AnswerOrUndefined[];

function QuestionScreen() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { uuid } = state;

    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const token = authHeader().split(" ")[1];

    const [reloaded, setReloaded] = useState(false);

    const { data, isError, isLoading, refetch } = useQuery(['question', uuid], () => fetchQuestion(auth()!.username, token, uuid), 
    {
        cacheTime: 0,
        staleTime: 0
    });

    useEffect(() => {
        setTimeout(() => {
            setReloaded(true);
            refetch();
        }, 400);
    }, []);


    const [questionNumber, setQuestionNumber] = useState(0);
    const [answerArr, setAnswerArr] = useState<AnswerArray>([undefined, undefined, undefined, undefined]);
    
    function sendQuestionToServer(question_id: number, answer: string, answer_id: number) {
        
        axios
        .post(chooseAnswerUrl, {username: auth()!.username, token: token, uuid: uuid, question_id: question_id, answer: answer } as UserWithAnswer)
        .then(res => {
            if(res.status == 200){

                let answer = res.data as answer;

                let newAnswers = answerArr;
                newAnswers[answer_id] = answer.answerCorrect;
                
                setAnswerArr([...newAnswers]);

                console.log(answerArr);

                setTimeout(() => {
                    // reset answer array
                    setAnswerArr([undefined, undefined, undefined, undefined]);

                    if(questionNumber > 1) {
                       
                        navigate(gameStatePath, {state: {uuid: uuid}});
                    }
    
                    setQuestionNumber(questionNumber+1); 
                }, 1500);

            }
        });

             
    }
    

    if(isError) {
        return <Text>Error</Text>
    }

    if(isLoading || data?.length == 0 || !reloaded) {
        return <Center mt={60}><Loader></Loader></Center>
    }

    if(data) {


        return (
            <Container my={20}>
    
                <Card withBorder padding="s" radius="md">
                    <Text m={20} fw={500} align="center">
                        {data[questionNumber].question_text}
                    </Text>
                </Card>
    
                <Space h={20}></Space>
    
                <Grid grow>
    
                    <Grid.Col span={6}>
                        <Answer answer={data[questionNumber].answer1} correct={answerArr[0]} onClick={() => {sendQuestionToServer(data[questionNumber].question_id, data[questionNumber].answer1, 0)} }></Answer>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Answer answer={data[questionNumber].answer2} correct={answerArr[1] == undefined ? undefined : answerArr[1] == true ? true : false} onClick={() => {sendQuestionToServer(data[questionNumber].question_id, data[questionNumber].answer2, 1)}}></Answer>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Answer answer={data[questionNumber].answer3} correct={answerArr[2] == undefined ? undefined : answerArr[2] == true ? true : false} onClick={() => {sendQuestionToServer(data[questionNumber].question_id, data[questionNumber].answer3, 2)}}></Answer>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Answer answer={data[questionNumber].answer4} correct={answerArr[3] == undefined ? undefined : answerArr[3] == true ? true : false} onClick={() => {sendQuestionToServer(data[questionNumber].question_id, data[questionNumber].answer4, 3)}}></Answer>
                    </Grid.Col>
                </Grid>
    
            </Container>
          );
    
    }

    
    return <Text>Error</Text>;
}

export default QuestionScreen;