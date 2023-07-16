import express from 'express'
import bootstrap from './src/app.router.js';
import cors from 'cors'



const app = express();
const port = 5000

app.use(cors())

bootstrap(app, express)


app.listen(port, ()=> console.log(`Server running on ${port}`))