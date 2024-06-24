import { User } from "../Models/user.models.js";
import { ApiError } from "../Utils/ApiErrorHandle.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';
export const verifyJWT = AsyncHandler(async(req,res,next) => {
   try {
     const accesstoken=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
     if(!accesstoken){
         throw new ApiError(401,'Unauthorized Request');
     }
     const decodedInfo= jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
     const user=await User.findById(decodedInfo?._id).select("-password -refreshToken");
     if(!user){
         throw new ApiError(401,"Invalid Access Token");
     }
     req.user=user;
     next()
   } catch (error) {
    throw new ApiError(401,error.message || "Invalid Access Token");
   }
})