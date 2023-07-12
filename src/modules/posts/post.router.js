import { Router } from "express"
import { addPost, deletePost, getAllPosts, getPostById, getSortedposts, updatePost } from "./controller/posts.controller.js"



const router = Router()

router.get("/", getAllPosts)
router.get("/search/:id", getPostById)
router.get("/getSortedposts", getSortedposts)
router.post("/", addPost)
router.delete("/:id", deletePost)
router.put("/:id", updatePost)



export default router


