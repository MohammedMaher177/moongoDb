import { Router } from "express";
import { getAllTheaters, getSubTheater } from "./controller/theaters.controller.js";


const router = Router()


router.get("/", getAllTheaters)
router.get("/search/:id", getSubTheater)
router.get("/search", getSubTheater)



export default router