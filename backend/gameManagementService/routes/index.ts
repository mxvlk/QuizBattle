import express from 'express';
import { v1GamesRoute } from './v1/activeGames';
import { v1GameDetailRoute } from './v1/gameDetail';
import { v1ScoreRoute } from './v1/score';
import { v1CreateGameRoute } from './v1/createNewGame';
import { v1FinishedGamesRoute } from './v1/finishedGames';
import { v1getCategoriesRoute } from './v1/getCategories';
import { v1chooseCategoryRoute } from './v1/chooseCategory';
import { v1getQuestionsRoute } from './v1/getQuestions';
import { v1pickAnswerRoute } from './v1/pickAnswer';

// export v1 Router
export const v1Routes = express.Router();

v1Routes.use(v1GamesRoute);
v1Routes.use(v1GameDetailRoute);
v1Routes.use(v1ScoreRoute);
v1Routes.use(v1CreateGameRoute);
v1Routes.use(v1FinishedGamesRoute);
v1Routes.use(v1getCategoriesRoute);
v1Routes.use(v1chooseCategoryRoute);
v1Routes.use(v1getQuestionsRoute);
v1Routes.use(v1pickAnswerRoute);