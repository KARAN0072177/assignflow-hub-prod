import { Router } from "express";
import { submitContactForm } from "./contact.controller";

const router = Router();

router.post("/submit", submitContactForm);

export default router;