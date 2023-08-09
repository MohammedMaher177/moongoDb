import usersModel from "../../../../DB/users.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

import asyncHandler from 'express-async-handler'
import postsModel from "../../../../DB/posts.model.js"


// 7-get all user 
export const getALlUsers = asyncHandler(async (req, res) => {
    const users = await usersModel.find().select("-password")
    res.json({ message: "success", users })
}
)
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await usersModel.findById(id).select("-password")
    if(!user){
        throw new Error("User Not Found")
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
    return res.json({ message: "success", user })
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
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.TOKEN_SIGNTURE)
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
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    // return res.json({message: "success", name, email, password, age, gender, id})

    const users = await usersModel.deleteOne({ _id: id })
    if (users.deletedCount) {

        return res.json({ message: "success", users })
    } else {
        return res.json({ message: "not found" })

    }
})

export const addFirend = asyncHandler(async (req, res) => {
    const { user } = req;
    const { user_id } = req.body
    console.log(user);
    if(user._id == user_id){
        throw new Error('can not add your self');
    }
    const recivedUser = await usersModel.findById(user_id)
    if(!recivedUser){
        throw new Error('user not found');
    }
    console.log(typeof recivedUser);
    if(!recivedUser.firendRequest.includes(user._id)){
        recivedUser.firendRequest.push(user._id)
    }else{
        console.log(user._id);
        recivedUser.firendRequest = recivedUser.firendRequest.filter((ele) => ele.toString() !== user._id.toString());   
     }
    await recivedUser.save();
    res.json({message:"success", param:"friend request sent", recivedUser})
})




/*P
5-search for user where his name start with "X" and age less than Y=>   (X,Y => variables)
6-search for user where his age is between X and Y
 */

export const searchByName = asyncHandler((async (req, res) => {
    const { name } = req.body
    usersModel.find({ name: { $regex: `^${name}`, $options: 'i' } })
        .then(users => {
            res.json({ message: "success", users })
        })
        .catch(err => {
            return res.json({ message: "not found", err })
        });

}
)
)
