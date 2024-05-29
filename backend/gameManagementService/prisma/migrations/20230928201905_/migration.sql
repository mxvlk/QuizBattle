-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "currentPlayer" TEXT,
    "task" INTEGER NOT NULL,
    "pickedCategory" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "questionsId1" INTEGER NOT NULL,
    "questionsId2" INTEGER NOT NULL,
    "questionsId3" INTEGER NOT NULL,
    "user1_answer1" BOOLEAN,
    "user1_answer2" BOOLEAN,
    "user1_answer3" BOOLEAN,
    "user2_answer1" BOOLEAN,
    "user2_answer2" BOOLEAN,
    "user2_answer3" BOOLEAN,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currentQuestions" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,

    CONSTRAINT "currentQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoryQuestion" (
    "id" SERIAL NOT NULL,
    "currentQuestionsId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "falseAnswer1" TEXT NOT NULL,
    "falseAnswer2" TEXT NOT NULL,
    "falseAnswer3" TEXT NOT NULL,

    CONSTRAINT "categoryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currentCategories" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "category1" TEXT NOT NULL,
    "category1_id" INTEGER NOT NULL,
    "category2" TEXT NOT NULL,
    "category2_id" INTEGER NOT NULL,
    "category3" TEXT NOT NULL,
    "category3_id" INTEGER NOT NULL,

    CONSTRAINT "currentCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_uuid_key" ON "Game"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "currentQuestions_gameId_key" ON "currentQuestions"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "currentCategories_gameId_key" ON "currentCategories"("gameId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currentQuestions" ADD CONSTRAINT "currentQuestions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoryQuestion" ADD CONSTRAINT "categoryQuestion_currentQuestionsId_fkey" FOREIGN KEY ("currentQuestionsId") REFERENCES "currentQuestions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currentCategories" ADD CONSTRAINT "currentCategories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
