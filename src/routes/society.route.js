import express from "express";
import { registerSocietyWithAdmin } from "../controllers/society.controller.js";

const societyRouter = express.Router();

societyRouter.post("registerSociety", registerSocietyWithAdmin);

export default societyRouter;
