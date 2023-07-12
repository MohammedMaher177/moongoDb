import postsModel from "../../../../DB/posts.model.js"
import usersModel from "../../../../DB/users.model.js"
import asyncHandler from 'express-async-handler'
import { updatesutil } from "../../../utils/updates.js"


export const getAllPosts = asyncHandler(async (req, res) => {
    await postsModel.find()
        .then(result => res.json({ message: "success", result }))
        .catch(error => res.json({ message: "error", error }))
})
export const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params
    await postsModel.findById(id)
        .then(result => {
            if (!result) return res.json({ message: "Not Found", param: "Invalid Id" })
            return res.json({ message: "success", result })
        })
        .catch(error => res.json({ message: "error", error }))
})

//1- add post (make sure that user already exist)
export const addPost = asyncHandler(async (req, res) => {
    const { title, content, authorId } = req.body
    const user = await usersModel.findById(authorId, "-password")
    if (user) {
        await postsModel.create({ title, content, authorId })
            .then(result => res.json({ message: "success", result }))
            .catch(error => {
                console.log(error);
                return res.json({ message: "error", error })
            })
    }
    else {
        return res.json({ message: "Error", param: "Invalide user" })
    }
})

//2- delete post (post creator only )
export const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { authorId } = req.body
    postsModel.findById(id)
        .then(result => {
            // console.log(result);
            if (!result) {
                return res.json({ message: "Post Not Found" })
            }
            if (result.authorId.toString() !== authorId) {
                return res.json({ message: "error55", param: "Dont have premession" })
            }
            postsModel.findByIdAndDelete(id)
                .then(result => res.json({ message: "succes", result }))
                .catch(error => res.json({ message: "error66", error }))
        })
        .catch(error => res.json({ message: "error77", error }))
    // res.json("SS")
})


//3- update post (post owner only)
export const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { authorId, content, title } = req.body
    const updates = { content, title }
    const result = await updatesutil(postsModel, id, authorId, updates)
    console.log(result.Error);
    if (result.Error) {

        return res.json({ message: "Catch Error", param: result.Error })
    }
    return res.json({ message: "success",param:"Post updated successfully", result })
})

//4- sort posts descending (By date)

export const getSortedposts = asyncHandler(async (req, res) => {
    await postsModel.find().sort({ createdAt: -1 })
        .then(result => res.json({ message: "success", result }))
        .catch(error => res.json({ message: "error", error }))
})