import usersModel from "../../../../DB/users.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

import asyncHandler from 'express-async-handler'
import postsModel from "../../../../DB/posts.model.js"
import sendEmail from "../../../utils/email.js";
import { emailTemp } from "../../../utils/emailTemp.js";
import { AppError } from "../../../utils/AppError.js";
import { deleteOneDoc } from "../../handller/factor.js";


// 7-get all user 
export const getALlUsers = asyncHandler(async (req, res) => {
    //1 - pag
    const PAGE_LIMIT = req.query.page ? 3 : true;
    const PAGE_NUMBER = req.query.page * 1 || 1
    if (PAGE_NUMBER <= 0) PAGE_NUMBER = 1
    const SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT
    //2 - filter
    // console.log(req.query);
    let filterObj = { ...req.query }
    const delObj = ['page', 'sort', 'fields', 'keyword']
    delObj.forEach(ele => {
        delete filterObj[ele]
    })
    filterObj = JSON.stringify(filterObj)
    filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    filterObj = JSON.parse(filterObj)

    const mongooseQuery = usersModel.find(filterObj).skip(SKIP).limit(PAGE_LIMIT).select("-password")
    //3 - sort
    if (req.query.sort) {
        let sortedQery = req.query.sort.split(",").join(" ")
        mongooseQuery.sort(sortedQery)
    }

    //4 - search
    if (req.query.keyword) {
        mongooseQuery.find({
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { email: { $regex: req.query.keyword, $options: "i" } },
                { gender: { $regex: req.query.keyword, $options: "i" } }
            ]
        })
    }
    //5 - fields
    if (req.query.fields) {
        let fieldsQery = req.query.fields.split(",").join(" ")
        mongooseQuery.select(fieldsQery)
    }
    const users = await mongooseQuery
    res.json({ message: "success", page: PAGE_NUMBER, users })
}
)
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await usersModel.findById(id).select("-password")
    if (!user) {
        throw new AppError("User Not Found", 404)
    }
    const posts = await postsModel.find({ authorId: user._id })
    res.json({ message: "success", user, posts })
}
)
export const search = asyncHandler((async (req, res) => {

    const { body } = req
    const users = await usersModel.find(req.body)
    res.json({ message: "success", users })

})
)
// 1-sign up ( email must be unique ) 
export const addUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, rePassword, age, gender, confirmEmail, phone } = req.body
    const hashPasword = bcrypt.hashSync(password, +process.env.HASH_SALT_ROUND)
    if (password != rePassword) {
        return next(new Error("Password and RePassword Mismatch"))
    }
    const checkUser = await usersModel.findOne({ email })
    if (checkUser) {
        return res.json({ message: "Error", param: "Email Already Exist" })
    }
    const newUser = new usersModel({ name, email, password: hashPasword, age, gender, phone })
    const user = await newUser.save()
    user.password = ''
    const verifyToken = jwt.sign({ id: user._id }, process.env.TOKEN_SIGNTURE)
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isActive: user.confirmEmail }, process.env.TOKEN_SIGNTURE)
    const link = `${req.protocol}://${req.headers.host}/api/v1/users/verifyemail/${verifyToken}`
    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: emailTemp(link)
    })
    return res.json({ message: "success", user, token })
})

export const verify = asyncHandler(async (req, res) => {
    const { verifyToken } = req.params
    const decoded = jwt.verify(verifyToken, process.env.TOKEN_SIGNTURE)
    const user = await usersModel.findByIdAndUpdate(decoded.id, { confirmEmail: true }, { new: true })
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isActive: user.confirmEmail }, process.env.TOKEN_SIGNTURE)
    if (user) {
        // res.json({ message: "success", token })
        return res.redirect(`https://social-media-ft14-ebiw27wvm-momaherfrontend-gmailcom.vercel.app/#/auth/verifyemail/${token}`)
    }
    else {
        return res.send(`<a href="${req.protocol}://${req.headers.host}/signup">looks you don't have account yet, follow this link to register now</a>`)
    }

})
//2-sign in 
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await usersModel.findOne({ email })
    if (!user) {
        return res.json({ message: "Error", param: "In-Valid Email or Password" })
    }
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return res.json({ message: "Error", param: "In-Valid Email or Password" })
    }
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isActive: user.confirmEmail }, process.env.TOKEN_SIGNTURE)
    user.password = ''
    return res.json({ message: "success", token, user })
})
//3-update user
export const updateUser = asyncHandler((async (req, res) => {
    const { name, email, password, age, gender, phone } = req.body;
    const { id } = req.user
    const hashPasword = bcrypt.hashSync(password, +process.env.HASH_SALT_ROUND)
    const user = await usersModel.updateOne({ _id: id }, { name, email, password: hashPasword, age, gender, phone })
    return res.json({ message: "success", user })

})
)
//4-delete user
export const deleteUser = deleteOneDoc(usersModel, "user")

/*P
5-search for user where his name start with "X" and age less than Y=>   (X,Y => variables)
6-search for user where his age is between X and Y
 */

export const searchByName = asyncHandler(async (req, res) => {
    const { name } = req.body
    usersModel.find({ name: { $regex: `^${name}`, $options: 'i' } })
        .then(users => {
            res.json({ message: "success", users })
        })
        .catch(err => {
            return res.json({ message: "not found", err })
        });
})

export const addFriend = asyncHandler(async (req, res) => {
    const { user } = req;
    const { user_id } = req.body
    let param;
    console.log(user);
    if (user._id == user_id) {
        throw new AppError('can not add your self', 405);
    }
    const recivedUser = await usersModel.findById(user_id)
    if (!recivedUser) {
        throw new AppError('user not found', 404);
    }
    if (!recivedUser.firendRequest.includes(user._id)) {
        recivedUser.firendRequest.push(user._id)
        param = "friend request sent"
    } else {
        console.log(user._id);
        recivedUser.firendRequest = recivedUser.firendRequest.filter((ele) => ele.toString() !== user._id.toString());
        param = "friend request Canceld"
    }
    await recivedUser.save();
    res.json({ message: "success", param, recivedUser })
})

export const friendRequests = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await usersModel.findById(_id).select("firendRequest").populate([{
        path: "firendRequest",
        select: "name email"
    }])
    res.json(user)
})

export const acceptFriend = asyncHandler(async (req, res) => {
    const { user } = req;
    const { user_id } = req.body
    if (user._id == user_id) {
        throw new AppError("can not add your self", 405)
    }
    if (!user.firendRequest.includes(user_id)) {
        throw new AppError("In-Valid user_id", 400)
    }
    user.firends.push(user_id)
    await user.save()
    user.firendRequest = user.firendRequest.filter(ele => ele != user_id)
    await user.save()
    res.json({ message: "success", param: "Firend Request Accepted", firendRequest: user.firendRequest })
})

export const rejectFriend = asyncHandler(async (req, res) => {
    const { user } = req;
    const { user_id } = req.body
    user.firendRequest = user.firendRequest.filter(ele => ele != user_id)
    await user.save()
    res.json({ message: "success", param: "Firend Request Rejected" })
})

