import { Router } from "express"
import { addUser, deleteUser, getALlUsers, getUserById, login, search, searchByName, updateUser } from "./controller/users.controller.js";
import { auth } from "../../middleware/authentication.js";


const router = Router()



router.get("/", getALlUsers)
router.get("/search/:id", getUserById)
router.get("/search", search)
router.get("/searchByName", searchByName)
router.post("/signup", addUser)
router.post("/login", login)
router.put("/updateUser", auth, updateUser)
router.delete("/deleteUser/:id", deleteUser)

export default router;