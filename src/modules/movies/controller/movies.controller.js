import moviesModel from "../../../../DB/movies.model.js"


export const getAllMovies = async (req, res) => {
    await moviesModel.find()
    .then(result => res.json({message: "success", result}))
    .catch(error=> res.json({message: "error", error}))
}

export const getSubMovie = async (req, res) => {
    const {id} = req.params
    await moviesModel.findById(id)
    .then(result => res.json({message: "success", result}))
    .catch(error=> res.json({message: "error", error}))
}
