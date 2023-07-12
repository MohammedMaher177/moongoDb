import theatersModel from "../../../../DB/theaters.model.js"

export const getAllTheaters = async (req, res) => {
    const theater = await theatersModel.find()
    res.json({ message: "success", theater })
}

export const getSubTheater = async (req, res) => {
    const { id } = req.params
    const theater = await theatersModel.findById(id)
    res.json({ message: "success", theater })
}

export const search = async (req, res) => {

    const { body } = req
    const theater = await theatersModel.find(   body)
    res.json({ message: "success", theater })
}

