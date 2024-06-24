import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const returnedResponseObject = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
        console.log(`\n Mongo Db Connected  !! DB Host : ${returnedResponseObject.connection.host} `);
    } catch (error) {
        console.log("Mongo Db Connection Error", error);
        process.exit(1);
    }
}

export default connectDB