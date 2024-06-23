import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from '../Utils/ApiErrorHandle.js'
import {ApiResponse} from '../Utils/ApiResponse.js'
import { User } from '../Models/user.models.js'
import Cloudinary from "../Utils/Cloudinary.js";
const registerUser = AsyncHandler(async (req, res) => {
    // get user details from frontend
    // check email already exist or not if yes then return
    // validation of user data
    //check for images ,check for avatar
    // if available then upload it to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { fullName, email, userName, password } = req.body
    if ([fullName, email, userName, password].some((field) => {
        return (field?.trim() === '')
    })) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser=User.findOne({
        $or: [{ email }, { userName }]
    })
    if(existedUser){
        throw new ApiError(404, "User with Email/UserName Already Exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is Required")
    }
    const avatarCloudinary= await Cloudinary(avatarLocalPath);
    const coverIamgeCloudinary=await Cloudinary(coverImageLocalPath);
    if(!avatarCloudinary){
        throw new ApiError(400,"Avatar is Required")
    }
    const userResponseObject=await User.create({
        fullName,
        avatar:avatarCloudinary.url,
        coverImage:coverIamgeCloudinary?.url || "",
        email,
        password,
        userName:userName.toLowerCase()
    })
    const createdUser=await User.findById(userResponseObject._id).select(
        "-password -refreshToken"
    )
    if (!createdUser){
        throw new ApiError(500,'Something went wrong while creating the user')
    }
    return res.status(200).json(
        new ApiResponse(200,createdUser,"User Created Successfully")
    )
    // res.send("Ok").status(200)
})

export default registerUser;
