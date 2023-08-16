
import { response } from 'express'
import { AppError } from '../../utils/AppError.js'
import { catchError } from '../../utils/errorHandler.js'


export const deleteOneDoc = (model, name) => {
    return catchError(async (req, res, next) => {
        const { id } = req.params

        const doccument = await model.deleteOne({ _id: id })

        if (doccument.deletedCount) {
            // const response = {}
            // response[name] = doccument
            return res.status(201).json({ message: "success", param: "Deleted" })
        } else {
            // return res.json({ message: "not found" })
            return next(new AppError("not found", 404))

        }
    })
}