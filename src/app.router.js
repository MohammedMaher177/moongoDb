
import connectionDb from '../DB/connection.js'
import userRouter from './modules/users/users.router.js'
import theatersRouter from './modules/theaters/theaters.router.js'
import moviesRouter from './modules/movies/movies.router.js'
import postsRouter from './modules/posts/post.router.js'
import commentsRouter from './modules/comments/comments.router.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    connectionDb()
    app.use("/api/v1/users", userRouter)
    app.use("/api/v1/theaters", theatersRouter)
    app.use("/api/v1/movies", moviesRouter)
    app.use("/api/v1/posts", postsRouter)
    app.use("/api/v1/comments", commentsRouter)
    app.use((error, req, res, next) => {
        return res.json({message: error.message, stack: error.stack})
    })
}

export default bootstrap