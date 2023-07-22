
import connectionDb from '../DB/connection.js'
import userRouter from './modules/users/users.router.js'
import theatersRouter from './modules/theaters/theaters.router.js'
import moviesRouter from './modules/movies/movies.router.js'
import postsRouter from './modules/posts/post.router.js'
import commentsRouter from './modules/comments/comments.router.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    connectionDb()
    app.use("/users", userRouter)
    app.use("/theaters", theatersRouter)
    app.use("/movies", moviesRouter)
    app.use("/posts", postsRouter)
    app.use("/comments", commentsRouter)
    app.use((error, req, res, next) => {
        return res.json({message: error.message, stack: error.stack})
    })
}

export default bootstrap