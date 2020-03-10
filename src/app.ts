import express, { Application} from 'express';

var app : Application = express();
app.get('/', (req, res) => {

})
const POST: string = process.env.PORT || '5000';
app.listen(POST, () => console.log(`Server running on port ${POST}`))