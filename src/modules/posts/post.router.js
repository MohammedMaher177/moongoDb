import { Router } from "express"
import { addPost, addPostComments, postlike, deletePost, getAllPosts, getPostById, getSortedposts, updatePost } from "./controller/posts.controller.js"
import { auth } from "../../middleware/authentication.js"



const router = Router()

router.get("/", getAllPosts)
router.get("/search/:id", getPostById)
router.get("/getSortedposts", getSortedposts)
router.post("/", auth, addPost)
router.post("/addComment", auth, addPostComments)
router.post("/like", auth, postlike)
router.delete("/:id", auth, deletePost)
router.put("/:id", auth, updatePost)



export default router


