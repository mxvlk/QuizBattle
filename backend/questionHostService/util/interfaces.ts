interface Category {
    id: number,
    name: string
}

interface Question {
    id: number,
    question_text: string,
    correct_answer: string,
    false_answer1: string,
    false_answer2: string,
    false_answer3: string,
    category_id: number
}


export {
    Category,
    Question
}
