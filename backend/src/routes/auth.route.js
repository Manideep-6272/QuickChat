import express from "express";
import { checkAuth, login, logout, signup ,updateProfile, updateUserInfo} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);
router.put("/updateProfile",protectRoute,updateProfile);
router.put("/updateUserInfo",protectRoute,updateUserInfo);
router.get("/check",protectRoute,checkAuth);
export default router;