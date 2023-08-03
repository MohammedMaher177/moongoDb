import asyncHandler from 'express-async-handler'
import commentsModel from "../../../../DB/comments.model.js"
import moviesModel from "../../../../DB/movies.model.js";
import usersModel from "../../../../DB/users.model.js";


export const getAllComments = asyncHandler(async (req, res) => {
    await commentsModel.find().populate([
        {
            path: "movie_id",
            select: "title cast"
        }, {
            path: "movie_id",
            select: "-password"
        }
    ])
        .then(result => {
            return res.json({ message: "success", result })
        }).catch(error => {
            console.log(error);
            return res.json({ message: "Catch Error", error })
        })
})

export const getComment = asyncHandler(async (req, res) => {

    const { id } = req.params

    await commentsModel.findById(id).populate([
        {
            path: "movie_id"
        }, {
            path: "user_id",
            select: "-password"
        }
    ])
        .then(result => {
            return res.json({ message: "success", result })
        }).catch(error => {
            console.log(error);
            return res.json({ message: "Catch Error", error })
        })
})

export const getSubComment = asyncHandler(async (req, res) => {
    const { movie_id } = req.body
    await commentsModel.find({ movie_id }).populate([
        {
            path: "movie_id"
        }
    ])
        .then(result => {
            return res.json({ message: "success", result })
        }).catch(error => {
            console.log(error);
            return res.json({ message: "Catch Error", error })
        })
}
)

export const addComment = asyncHandler(async (req, res) => {
    const { movie_id, name, email, text} = req.body
    const user_id =req.user._id
    const checkMovie = await moviesModel.findById(movie_id)
    const checkuser = await usersModel.findById(user_id)
    if (!checkMovie) {
        return res.json({ message: "Catch Error", param: "Invalid Movie ID" })
    }
    if (!checkuser) {
        return res.json({ message: "Catch Error", param: "Invalid User ID" })
    }
    const newComment = new commentsModel({ movie_id, name, email, text, user_id })
    const comment = await newComment.save()
    return res.json({ message: "success", comment })
})

export const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    commentsModel.findById(id)
        .then(comment => {
            if (!comment) {
                return res.json('Comment not found');
            }
            if (comment.user_id != user_id) {
                return res.json('Unauthorized');
            }
            // User is authorized to delete the comment
            // commen.delete()
            commentsModel.findByIdAndDelete(id)
                .then(() => {
                    res.send('Comment deleted successfully');
                })
                .catch(error => {
                    console.log('Error deleting comment:', error);
                    res.send('Error deleting comment:', error);
                });
        })
        .catch(error => {
            console.error('Error finding comment:', error);
            res.send('Internal server error');
        });

})  
