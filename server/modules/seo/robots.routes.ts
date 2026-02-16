import { Router } from "express";
import { generateRobots } from "./robots.controller";

const router = Router();

router.get("/robots.txt", generateRobots);

export default router;