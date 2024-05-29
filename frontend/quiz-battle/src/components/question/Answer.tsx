import { Flex, Text, Avatar, Card, CardProps, createStyles, useMantineColorScheme } from '@mantine/core';

export interface AnswerProps {
    answer: String,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    correct?: Boolean
}

const useStyles = createStyles((theme) => ({
  answer: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  correctAnswer: {
    backgroundColor: '#228be6',
  },
  falseAnswer: {
    backgroundColor: '#b6b6b6'
  }
}));

export function Answer(props: AnswerProps) {

  const { classes, cx } = useStyles();

  return (
    <Card withBorder padding="s" radius="md" h='100%' mih={130} onClick={props.onClick} className={
        cx(classes.answer, { [classes.correctAnswer]: props.correct === true}, {[classes.falseAnswer]: props.correct === false})
    }>
      <Flex justify='center' align='center' p={20} h='100%'>
        <Text align='center' lineClamp={3}>
              {props.answer}
          </Text>
      </Flex>

    </Card>
  );
}