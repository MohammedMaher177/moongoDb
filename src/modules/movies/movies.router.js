import { Router } from "express" 
import { getAllMovies, getSubMovie } from "./controller/movies.controller.js"


const router = Router()



router.get("/", getAllMovies)
router.get("/:id", getSubMovie)





export default router