import express, { Application, Router } from 'express';

const bodyParse = require('body-parser');
const app : Application = express();

//Middleware
app.use(bodyParse({limit: '50mb'}));
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

//Router import
import ImageRouter from './routes/imageRouter';

app.use('/', ImageRouter);

const POST: string = process.env.PORT || '5000';
app.listen(POST, () => console.log(`Server running on port ${POST}`))