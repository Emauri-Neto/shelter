import { Router } from "express";
import { getUserController } from "../controllers/user.controller";


const userRoutes = Router();

// prefix: /user

userRoutes.get('/', getUserController);

export default userRoutes;