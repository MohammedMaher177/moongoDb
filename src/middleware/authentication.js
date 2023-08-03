
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import usersModel from "../../DB/users.model.js";
import { parse } from "dotenv";
// import { userModel } from "../../DB/Models/user.model.js";






export const auth = asyncHandler(async (req, res, next) => {
    const { authorizathion } = req.headers;
    if (!authorizathion) {
        return next(new Error("authorizathion is required"))
    }
    const decoded = jwt.verify(authorizathion, process.env.TOKEN_SIGNTURE)

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