
import connectionDb from '../DB/connection.js'
import userRouter from './modules/users/users.router.js'
import theatersRouter from './modules/theaters/theaters.router.js'


const bootstrap = (app, express) => {
    app.use(express.json())
    connectionDb()
    app.use("/users", userRouter)
    app.use("/theaters", theatersRouter)
}

export default bootstrap