import { Router } from "express"
import { addUser, deleteUser, getALlUsers, getUserById, login, search, updateUser } from "./controller/users.controller.js";


const router = Router()



router.get("/", getALlUsers)
router.get("/search/:id", getUserById)
router.get("/search", search)
router.post("/signup", addUser)
router.post("/login", login)
router.put("/updateUser/:id", updateUser)
router.delete("/deleteUser/:id", deleteUser)

export default router;