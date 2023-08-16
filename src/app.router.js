
import connectionDb from '../DB/connection.js'
import userRouter from './modules/users/users.router.js'
import theatersRouter from './modules/theaters/theaters.router.js'
import moviesRouter from './modules/movies/movies.router.js'
import postsRouter from './modules/posts/post.router.js'
import commentsRouter from './modules/comments/comments.router.js'
import { AppError } from './utils/AppError.js'
import { globalError } from './middleware/globalErrorMiddleware.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    connectionDb()
    app.use("/api/v1/users", userRouter)
    app.use("/api/v1/theaters", theatersRouter)
    app.use("/api/v1/movies", moviesRouter)
    app.use("/api/v1/posts", postsRouter)
    app.use("/api/v1/comments", commentsRouter)


    app.all('*', (req, res, next) => {
        // res.status(404).json({ message: "Page Not-Found" })
        next(new AppError("Page Not-Found", 404))
    });


    app.use(globalError)
}

export default bootstrap