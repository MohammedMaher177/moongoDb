import usersModel from "../../../../DB/users.model.js"
import bcrypt from "bcrypt"

import asyncHandler from 'express-async-handler'


// 7-get all user 
export const getALlUsers = asyncHandler(async (req, res) => {
    const users = await usersModel.find().select("-password")
    res.json({ message: "success", users })
}
)
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const users = await usersModel.findById(id).select("-password")
    res.json({ message: "success", users })
}
)
export const search = asyncHandler((async (req, res) => {

    const { body } = req
    const users = await usersModel.find(req.body)
    res.json({ message: "success", users })

})
)
// 1-sign up ( email must be unique ) 
export const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, rePassword, age, gender, confirmEmail } = req.body
    const hashPasword = bcrypt.hashSync(password, 8)
    if (password != rePassword) {
        return res.json({ message: "Error", param: "Password and RePassword Mismatch" })
    }
    const checkUser = await usersModel.findOne({ email })
    if (checkUser) {
        return res.json({ message: "Error", param: "Email Already Exist" })
    }
    const newUser = new usersModel({ name, email, password: hashPasword, age, gender })
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
    user.password = ""
    return res.json({ message: "success", user })
})
//3-update user
export const updateUser = asyncHandler((async (req, res) => {
    const { name, email, password, age, gender } = req.body;
    const { id } = req.params
    const hashPasword = bcrypt.hashSync(password, 8)
    const users = await usersModel.updateOne({ _id: id }, { name, email, hashPasword, age, gender })
    return res.json({ message: "success", users })

})
)
//4-delete user
export const deleteUser = asyncHandler((async (req, res) => {
    const { id } = req.params
    // return res.json({message: "success", name, email, password, age, gender, id})

    const users = await usersModel.deleteOne({ _id: id })
    if (users.deletedCount) {

        return res.json({ message: "success", users })
    } else {
        return res.json({ message: "not found" })

    }
})
)



/*
5-search for user where his name start with "X" and age less than Y=>   (X,Y => variables)
6-search for user where his age is between X and Y
 */

export const searchByName = asyncHandler((async (req, res) => {
    const { minAge, maxAge } = req.body
    usersModel.find({ name: { $regex: '^X', $options: 'i' }, age: { $lt: maxAge, $gte: minAge } })
        .then(users => {
            res.json({ message: "success", users })
        })
        .catch(err => {
            return res.json({ message: "not found", err })
        });

}
)
)
