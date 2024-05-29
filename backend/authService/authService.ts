import express from 'express';
import cors from 'cors';
import { v1Routes } from './routes';

// constants
const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';
const app = express();

// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cors for cross origin
app.use(cors());

// v1 api routes
app.use('/api/v1', v1Routes);

// start the server
app.listen(PORT, HOST, 1, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
