import dotenv from 'dotenv'
import connectDB from './DB/index.js';
import app from './app.js';
dotenv.config({
    path: "./env"
})

connectDB().then((res) => {
    app.on('error',(error)=>{
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(` App listen on the port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log(`Mongo Db Connection failed`)
})









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

