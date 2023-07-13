import commentsModel from "../../../../DB/comments.model.js"
import moviesModel from "../../../../DB/movies.model.js";


export const getAllComments = async (req, res) => {
    await commentsModel.find().populate([
        {
            path: "movie_id",
            select: "title cast"
        }
    ])
        .then(result => {
            return res.json({ message: "success", result })
        }).catch(error => {
            console.log(error);
            return res.json({ message: "Catch Error", error })
        })
}

export const getComment = async (req, res) => {

    const { id } = req.params

    await commentsModel.findById(id).populate([
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

export const getSubComment = async (req, res) => {
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


export const addComment = async (req, res) => {
    const { movie_id, name, email, text } = req.body
    const checkMovie = moviesModel.findById(movie_id)
    // console.log(checkMovie);
    if (!checkMovie) {
        return res.json({ message: "Catch Error", param: "Invalid Movie ID" })
    }
    const newComment = new commentsModel({ movie_id, name, email, text })
    const comment = await newComment.save()
    return res.json({ message: "success", comment })


}