import { Router } from "express";
import { addComment, deleteComment, getAllComments, getComment, getSubComment } from "./controller/comments.controller.js";


const router = Router();

router.get("/", getAllComments)
router.get("/search/:id", getComment)
router.get("/subComment", getSubComment)
router.post("/", addComment)
router.delete("/:id", deleteComment)



export default router;