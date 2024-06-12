import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    videoFile:{
        type:String,
        required:true,
    },
    thumbail:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        required:true,
    },
}, { timestamps: true })

export const Video = mongoose.model("Video", videoSchema)