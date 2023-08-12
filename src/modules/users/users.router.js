import { Router } from "express"
import { acceptFriend,  addFriend, addUser, deleteUser, getALlUsers, getUserById, login, rejectFriend, search, searchByName, updateUser } from "./controller/users.controller.js";
import { auth } from "../../middleware/authentication.js";


const router = Router()



router.get("/", getALlUsers)
router.get("/search/:id", getUserById)
router.get("/search", search)
router.get("/searchByName", searchByName)
router.post("/signup", addUser)
router.post("/login", login)
router.put("/updateUser", auth, updateUser)
router.delete("/deleteUser/:id", auth, deleteUser)
router.post("/addfriend", auth, addFriend)
router.post("/acceptfriend", auth, acceptFriend)
router.post("/rejectfriend", auth, rejectFriend)

export default router;