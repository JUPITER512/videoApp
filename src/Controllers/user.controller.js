import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from '../Utils/ApiErrorHandle.js'
import { ApiResponse } from '../Utils/ApiResponse.js'
import { User } from '../Models/user.models.js'
import Cloudinary from "../Utils/Cloudinary.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.refreshtoken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While Generating Access And Refresh Token")
    }
}



export const registerUser = AsyncHandler(async (req, res) => {
    // get user details from frontend
    // check email already exist or not if yes then return
    // validation of user data
    //check for images ,check for avatar
    // if available then upload it to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    try {
        const { fullName, email, userName, password } = req.body
        if ([fullName, email, userName, password].some((field) => {
            return (field?.trim() === '')
        })) {
            throw new ApiError(400, "All fields are required")
        }
        const existedUser = await User.findOne({
            $or: [{ email }, { userName }]
        })
        if (existedUser) {
            throw new ApiError(404, "User with Email/UserName Already Exists")
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImageLocalPath=req.files?.coverImage[0]?.path;
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is Required")
        }
        const avatarCloudinary = await Cloudinary(avatarLocalPath);
        const coverIamgeCloudinary = await Cloudinary(coverImageLocalPath);
        // let coverIamgeCloudinary;

        if (!avatarCloudinary) {
            throw new ApiError(400, "Avatar is Required")
        }
        const userResponseObject = await User.create({
            fullName,
            avatar: avatarCloudinary.url,
            coverImage: coverIamgeCloudinary?.url || "",
            email,
            password,
            userName: userName.toLowerCase()
        })
        const createdUser = await User.findById(userResponseObject._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            throw new ApiError(500, 'Something went wrong while creating the user')
        }
        return res.status(200).json(
            new ApiResponse(200, createdUser, "User Created Successfully")
        )
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json(new ApiError(400, error.message));
        }
        if (error.code === 11000) { // handle duplicate key error
            return res.status(409).json(new ApiError(409, "Duplicate key error: Email or Username already exists"));
        }
        return res.status(500).json(new ApiError(500, "Server Error"));
    }
    // res.send("Ok").status(200)
})

export const loginUser = AsyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;
    console.log(email, userName, password)
    if (!(userName || email)) {
        throw new ApiError(400, "Username or email required")
    }
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (!user) {
        throw new ApiError(404, "User Does Not Exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUSer = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie('refreshToken', refreshToken, options).
        json(
            new ApiResponse(200, {
                user: loggedInUSer, accessToken, refreshToken
            }, "User Logged In Successfully")
        )
})

export const logoutUser = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined,

            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out"))
})

export const refreshAccessToken = AsyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }
    try {
        const decodedInfo = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401,error.message)
    }
    const user = await User.findById(decodedInfo?._id);
    if (!user) {
        throw new ApiError(404, 'Invalid refresh Token')
    }
    if (incomingRefreshToken != user?.refreshToken) {
        throw new ApiError(404, "Refresh Token Is Expired or Used");
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const {newAccessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user?._id)
    return res.
        status(200).
        cookie("accessToken", newAccessToken, options).
        cookie('refreshToken', newRefreshToken, options).json(new ApiResponse(200,{newAccessToken,refreshToken:newRefreshToken},
            "Access Token Refreshed"
        ))
})

