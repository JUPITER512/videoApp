import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    content:{
        type:String
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    owener:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)