import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getProfile, updateProfile, updatePassword } from "../controllers/userController";

const router = Router();

router.use(authenticate);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/me/password", updatePassword);

export default router; 