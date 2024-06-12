import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    fullName:{
        type:String,
        required:true
    },
    avatar:{
        type: String,// cloudinary url
        required:true
    },
    coverImage:{
        type: String,// cloudinary url
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },

},{timestamps:true})

export const User=mongoose.model("User",userSchema)