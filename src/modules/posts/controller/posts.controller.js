import postsModel from "../../../../DB/posts.model.js"
import usersModel from "../../../../DB/users.model.js"
import asyncHandler from 'express-async-handler'
import { updatesutil } from "../../../utils/updates.js"
import { connect } from "mongoose"


export const getAllPosts = asyncHandler(async (req, res) => {
    await postsModel.find().populate([
        {
            path: "authorId",
            select: "-password"
        }
    ])
        .then(result => res.json({ message: "success", result }))
        .catch(error => res.json({ message: "error", error }))
})
/*get post details */
export const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params
    await postsModel.findById(id)
        .populate([{
            path: "authorId",
            select: "name email"
        }, {
            path: "postComments.user_id",
            select: "name email"
        }, {
            path: "postLikes",
            select: "name email"
        }])
        .then(result => {
            if (!result) return res.json({ message: "Not Found", param: "Invalid Id" })
            return res.json({ message: "success", result })
        })
        .catch(error => res.json({ message: "error", error }))
})

//1- add post (make sure that user already exist)
export const addPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body
    console.log(req.user);
    const authorId = req.user._id
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
    const  authorId  = req.user._id
    console.log(authorId);
    postsModel.findById(id)
        .then(result => {
            // console.log(result);
            if (!result) {
                return res.json({ message: "Post Not Found" })
            }
            if (result.authorId.toString() !== authorId.toString()) {
                return res.json({ message: "error", param: "Dont have premession" })
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
    const {  content, title } = req.body
    const  authorId  = req.user.id
    const updates = { content, title }
    const result = await updatesutil(postsModel, id, authorId, updates)
    console.log(result.Error);
    if (result.Error) {
        return res.json({ message: "Catch Error", param: result.Error })
    }
    return res.json({ message: "success", param: "Post updated successfully", result })
})

//4- sort posts descending (By date)
export const getSortedposts = asyncHandler(async (req, res) => {
    await postsModel.find().sort({ createdAt: -1 }).populate([
        {
            path: "authorId",
            select: "-password"
        }
    ])
        .then(result => res.json({ message: "success", result }))
        .catch(error => res.json({ message: "error", error }))
})

/*add comment to post */
export const addPostComments = asyncHandler(async (req, res) => {
    const { post_id, content } = req.body;
    const user_id = req.user._id
    const post = await postsModel.findById(post_id)
    if (!post) {
        return res.json({ message: "Error", param: "post ID Not Found" })
    }
    const updates = { user_id, content }
    const new_post = await postsModel.findByIdAndUpdate(post_id,
        { $push: { postComments: updates } },
        { new: true },)
    return res.json({ new_post })
})

/*like and unlike to post */
export const postlike = asyncHandler(async (req, res, next) => {
    const { postId } = req.body;
    const userId = req.user._id;
    let param = ''
    const user = await usersModel.findById(userId);
    if (!user) {
        return next(new Error("In-Valid user ID"))
    }
    const post = await postsModel.findById(postId)
    if (!post) {
        return next(new Error("In-Valid Post ID"))
    }
    console.log(post);
    if (post.postLikes.includes(userId)) {
        post.postLikes = post.postLikes.filter((ele) => ele.toString() !== userId.toString())
        await post.save()
        param = "Un Like"
        // return res.json({ message: 'success', param: "Un Like", post });
    } else {
        post.postLikes.push(userId)
        await post.save()
        param = "Like"
    }
    return res.json({ message: 'success', param: param, post });
    // .populate('postLikes');
})




// if (checkPost.postLikes.includes(userId)) {
//     post.postLikes = post.postLikes.filter((ele) => ele.toString() !== userId.toString())
//     // const post = await postsModel.findByIdAndUpdate(postId, {
//     //     $pull:
//     //     {
//     //         postLikes: userId
//     //     }
//     // },
//     //     { new: true })
//     await post.save()
//     return res.json({ message: 'success', param: "Un Like", post });
// } else {

//     post.postLikes.push(userId)
//     // const post = await postsModel.findByIdAndUpdate(postId,
//     //     {
//     //         $push:
//     //         {
//     //             postLikes: userId
//     //         }
//     //     },
//     //     { new: true })
//     await post.save()
//     return res.json({ message: 'success', param: "Like", post });
// }