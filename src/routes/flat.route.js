import express from "express";
import { flatRegisterRequest } from "../controllers/flat.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";

const flatRouter = express.Router();

flatRouter.post("/flatRegisterRequest", verifyJwt, flatRegisterRequest);

export default flatRouter;
