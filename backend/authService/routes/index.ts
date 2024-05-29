import express from 'express';
import { v1LoginRoute } from './v1/login';
import { v1RegisterRoute } from './v1/register';

// export v1 Router
export const v1Routes = express.Router();

// add routes to v1 Router
v1Routes.use(v1LoginRoute);
v1Routes.use(v1RegisterRoute);