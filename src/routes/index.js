'use strict'
import { Router } from "express";
import user from "./userRoutes.js";

const router = Router();

router.use("/user", user);


export default router;