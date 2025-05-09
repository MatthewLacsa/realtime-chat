import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
//authentication and create for signup, login, logout
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
//update the profile pic, with authentication before execution
router.put("/update-profile", protectRoute, updateProfile);
//check if logged in
router.get("/check", protectRoute, checkAuth);

export default router;