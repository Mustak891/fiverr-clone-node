import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clientRouter } from './routes/Client.js';
import { jobRouter } from './routes/Job.js';

const app = express();

dotenv.config();

const Port = process.env.PORT || 4000;

const ConnectDB = async () => {
    try{
        mongoose.connect(process.env.MongoDB_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("mongoDB connected");
    }
    catch (err){
         console.log(err)
    }
}
await ConnectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://mondaycrm.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.get('/', (req,res) => {
    res.send("hello world");
})

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use('/api', clientRouter);

app.use('/api', jobRouter);

app.listen(Port, () => {console.log(`Server is running on port ${Port}`)})