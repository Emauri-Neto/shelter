import { Router } from "express";
import { deleteSessionController, getSessionController } from "../controllers/session.controller";


const sessionRoutes = Router();

// prefix: /sessions

sessionRoutes.get('/', getSessionController);
sessionRoutes.delete('/:id', deleteSessionController)

export default sessionRoutes;