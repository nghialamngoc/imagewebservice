import express, { Application, Router } from 'express';

const app : Application = express();

//Router import
import ImageRouter from './routes/imageRouter';

app.use('/', ImageRouter);

const POST: string = process.env.PORT || '5000';
app.listen(POST, () => console.log(`Server running on port ${POST}`))