import commentsModel from "../../../../DB/comments.model.js"
import moviesModel from "../../../../DB/movies.model.js"


export const getAllMovies = async (req, res) => {
    await moviesModel.find().limit(10)
    .then(result => res.json({message: "success", result}))
    .catch(error=> res.json({message: "error", error}))
}

export const getSubMovie = async (req, res) => {
    const {id} = req.params
    const result = await moviesModel.findById(id)
    .then(result => result)
    .catch(error=> res.json({message: "error", error}))
    const comments = await commentsModel.find({movie_id : result._id})
    return res.json({message: "success", result, comments})
}


