import express from 'express';
import cors from 'cors';
import scriptures from './routes/scriptures.js';
import users from './routes/users.js';
import { config }  from 'dotenv';
import cookieParser from 'cookie-parser';

config();

const app = express();

const { PORT } = process.env || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/scriptures', scriptures);
app.use('/users', users)

app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});