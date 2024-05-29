import express from 'express';
import { v1CategoryRoute } from './v1/category';
import { v1QuestionRoute } from './v1/question';

// export v1 Router
export const v1Routes = express.Router();

// add routes to v1 Router
v1Routes.use(v1CategoryRoute);
v1Routes.use(v1QuestionRoute);
