import { Router } from "express" 
import { getAllMovies } from "./controller/movies.controller.js"


const router = Router()



router.get("/", getAllMovies)
router.get("/:id", getAllMovies)





export default router