import dotenv from 'dotenv'
dotenv.config({
    path:"./env"
})

import express from 'express';
import connectDB from './DB/index.js';

connectDB()







// const app = express();

// (async () => {
//     const DB_URL = process.env.MONGODB_URI;
//     try {
//         await mongoose.connect(`${DB_URL}/${DB_NAME}`);
//         app.on("error", (err) => {
//             console.log("Err ", err);
//             throw err
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`Server Started on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log(`Error Occured in DB Connection`)
//         throw error
//     }
// })();

