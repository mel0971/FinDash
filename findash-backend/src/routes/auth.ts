import { Router, Request, Response } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/register", (req: Request, res: Response) => authController.register(req, res));
router.post("/login", (req: Request, res: Response) => authController.login(req, res));

export default router;
