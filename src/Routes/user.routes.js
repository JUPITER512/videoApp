import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middlewear.js";
import { verifyJWT } from "../Middlewares/auth.middlewear.js";
const   userRouter=Router();


// /user/register
userRouter.route('/register').post(upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)
userRouter.route('/login').post(loginUser)


//securedRoute
userRouter.route('/logout').post(verifyJWT,logoutUser)
userRouter.route('/refreshToken').post(refreshAccessToken)



export default userRouter;