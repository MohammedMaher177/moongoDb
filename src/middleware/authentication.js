
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import usersModel from "../../DB/users.model.js";
import { parse } from "dotenv";
// import { userModel } from "../../DB/Models/user.model.js";






export const auth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error("authorization is required"))
    }
    const decoded = jwt.verify(authorization, process.env.TOKEN_SIGNTURE)

    if (!decoded?.id) {
        return next(new Error("Invalid Token payload"))
    }
    const user = await usersModel.findById(decoded.id)
    if(!user){
        return next(new Error("Email not found"))
    }
    req.user = user
    req.body.id = user._id
    return next()
})