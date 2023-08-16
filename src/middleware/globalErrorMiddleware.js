


export const globalError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500
    res.status(statusCode)
        .json({ message: error.message, stack: error.stack })
}