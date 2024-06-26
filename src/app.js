import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"})); //accept json
app.use(express.urlencoded({extended:true,limit:"16kb"}))// extended ka matalab objects k andr object
app.use(express.static("public")) //to store file folder in the public folder that's why we use static
app.use(cookieParser());



//routes import 
import userRouter from './Routes/user.routes.js';


//routes declaration
app.use("/api/v1/users",userRouter)
//http://localhost:3000/api/v1/users/register









export default app