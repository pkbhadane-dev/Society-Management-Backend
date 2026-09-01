import express from "express";
import { flatRegisterRequest } from "../controllers/flat.controller.js";

const flatRouter = express.Router();

flatRouter.post("/flatRegisterRequest", flatRegisterRequest );

export default flatRouter;
