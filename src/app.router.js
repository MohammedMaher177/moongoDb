
import connectionDb from '../DB/connection.js'
import userRouter from './modules/users/users.router.js'
import theatersRouter from './modules/theaters/theaters.router.js'
import moviesRouter from './modules/movies/movies.router.js'
import postsRouter from './modules/posts/post.router.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    connectionDb()
    app.use("/users", userRouter)
    app.use("/theaters", theatersRouter)
    app.use("/movies", moviesRouter)
    app.use("/posts", postsRouter)
}

export default bootstrap