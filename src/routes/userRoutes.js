import { Router } from "express";
const router = Router();
import {
    deleteUser,
    getUser,
    getUsersList,
    signIn,
    signUp,
    updateUser,
} from "../controllers/userController.js";
import { validateAccessToken, } from "../middleware/auth.js";
// import { uploadProfileImage } from "../utils/imageHelper.js";

router.post("/signUp", signUp);
// router.post("/signUp", uploadProfileImage, signUp);
router.post("/signIn", signIn);
router.get("/getUsersList", validateAccessToken, getUsersList); //  authorizeRoles(0), if role base
router.get("/getuser/:id", validateAccessToken, getUser);
router.put("/updateUser/:id", validateAccessToken, updateUser);
router.patch("/deleteUser/:id", validateAccessToken, deleteUser);

export default router;