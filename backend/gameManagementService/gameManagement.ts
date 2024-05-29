import express from 'express';
import cors from 'cors';
import { v1Routes } from './routes';

// Constants
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

// App
const app = express();

// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/v1', v1Routes);


// Start the actual server
app.listen(PORT, HOST, 1, ()=>{console.log(`Running on http://${HOST}:${PORT}`);});
